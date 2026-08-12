---
name: elearning-auth-frontend
description: Conventions and structure for the e-learning Login/Register frontend (React + Vite + Tailwind CDN, built from the "E Learning Site (Community)" Figma file). Use when adding, editing, or debugging anything under components/elearning-auth/frontend — new auth pages, form fields, validation, styling, or API wiring.
---

# E-Learning Auth Frontend

React (Vite) frontend for the Login and Register screens of an e-learning platform, matched pixel-for-pixel against the Figma file **"E Learning Site (Community)"** (frames `Login` 28:131 and `Register` 28:172). This skill is scoped to this frontend only — the sibling Flask backend lives in `../backend` and has its own conventions (JWT, SQLite, `/api/*` routes).

## Stack

- React 19 + React Router 7, built with Vite 7
- Styling: Tailwind via the CDN script in `index.html` (`<script src="https://cdn.tailwindcss.com">`) — no Tailwind build config, no PostCSS. Do not add `tailwind.config.js` or install `tailwindcss` as a dependency; this mirrors the sibling `login-signup-mysql-otp` frontend's setup.
- Icons: `lucide-react` (used for the password show/hide toggle). Prefer it over hand-authored SVGs for any new icon.
- Font: Poppins, loaded via Google Fonts `<link>` in `index.html`, applied globally in `src/index.css`.

## Directory structure

```
src/
├── api.js                    axios instance + token storage helpers
├── App.jsx                   routes: /, /login, /register
├── main.jsx                  entry point (BrowserRouter)
├── index.css                 global font/reset
├── assets/                   login-photo.jpg, register-photo.jpg (from Figma, committed — not remote asset URLs)
├── components/
│   ├── AuthShell.jsx          shared split-screen layout (photo panel + form panel) + AuthTabs pill switcher
│   └── AuthField.jsx          shared pill-style labeled input, supports `error` and `endAdornment`
├── pages/
│   ├── Login.jsx
│   └── Register.jsx
└── utils/
    └── validation.js          EMAIL_RE, USERNAME_RE, passwordIssues()
```

`Login.jsx` and `Register.jsx` are both built on `AuthShell` — don't duplicate the split-screen/tab-switcher markup in a new page; extend `AuthShell` if a third auth screen (e.g. forgot-password) is ever added.

## Design tokens (from Figma — keep these exact)

| Token | Value | Usage |
|---|---|---|
| Accent teal | `#49bbbd` | buttons, input borders, active tab, focus ring |
| Accent teal (muted) | `rgba(73,187,189,0.6)` / `#49bbbd/60` | inactive tab track background |
| Page background | `#fffefc` | `<body>` / `AuthShell` root |
| Body text | `#5b5b5b` | description paragraphs |
| Placeholder text | `#acacac` | input placeholders |
| Border radius | `rounded-full` (inputs are 54px tall → fully pill), `rounded-[29px]` (photo panel) | — |
| Font | Poppins — Bold (headings), Medium (tab labels), Regular (body), Light (fine print) | — |

Photo panel text overlay, tab switcher pill, and input pill shapes are load-bearing to the design — don't flatten them to generic rectangular Tailwind defaults when editing.

## Auth/token handling

`src/api.js` exports `setToken(token, persist)`, `getToken()`, `clearToken()` in addition to the default axios instance:
- `persist === true` → `localStorage` (survives browser restart) — used when "Remember me" is checked on Login.
- `persist === false` → `sessionStorage` (cleared when the tab closes) — default.
- The axios request interceptor reads via `getToken()` and attaches `Authorization: Bearer <token>` automatically — never manually set that header in a page component.
- Base URL is hardcoded to `http://localhost:5001/api` (the sibling backend's port). If the backend port/URL ever changes, update it here, not per-call.

## Validation

Client-side rules live in `src/utils/validation.js` and **must stay in sync with the backend's rules** in `components/elearning-auth/backend/app/auth.py` (`validate_password`, `USERNAME_RE`, `EMAIL_RE`):
- Email: standard `x@y.z` shape (`EMAIL_RE`)
- Username: 3–30 chars, letters/numbers/`_`/`.` (`USERNAME_RE`)
- Password: 8+ chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit (`passwordIssues`)

Both pages validate on submit (not on every keystroke) and surface errors per-field via `AuthField`'s `error` prop, plus a top-of-form banner for server-side errors (e.g. "Username or email already registered").

## Running

```bash
npm install
npm run dev      # http://localhost:5173 — requires the backend running on :5001
npm run build    # production build to dist/
```

## Extending

- **New field on an existing form**: add state + a `<AuthField>` in the page component; add matching validation to `validate()` in that page and mirror it server-side.
- **New auth-related page** (e.g. forgot-password): wrap it in `<AuthShell>`, pass `active` as `undefined`/a new tab state if it needs the Login/Register switcher, or omit `AuthTabs` usage inside `AuthShell` if the new page shouldn't show it.
- **Changing colors/spacing**: check the Figma file first (`E Learning Site (Community)`, frames `Login`/`Register`) rather than eyeballing — this frontend intentionally pixel-matches it.
