# E-Learning Auth (Login / Register)

Login and Register screens for an e-learning platform, built from the Figma file **"E Learning Site (Community)"** (frames `Login` and `Register`), plus a Flask + JWT + SQLite backend.

Colors, typography (Poppins), spacing and layout follow the Figma design. Placeholder "Lorem Ipsum" copy in the design was replaced with real e-learning copy; the eye-icon toggle uses `lucide-react` instead of the exported SVG for scalability/consistency with the rest of the repo.

## Structure

```
elearning-auth/
├── backend/     Flask API — JWT auth, SQLite, hashed passwords
└── frontend/    React (Vite) — Login + Register pages
```

## Backend

```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate        # Windows (PowerShell: .venv\Scripts\Activate.ps1)
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Runs on `http://localhost:5001`. A SQLite file is created at `backend/instance/elearning.db` on first run.

### Endpoints

| Method | Path            | Auth | Description |
|--------|-----------------|------|--------------|
| POST   | `/api/register` | –    | Create a user. Validates username/email/password, hashes password, returns a JWT. |
| POST   | `/api/login`    | –    | Verify credentials, return a JWT. |
| POST   | `/api/logout`   | Bearer token | Revokes the token's `jti` server-side (stored in `revoked_tokens`), so it can no longer be used. |
| GET    | `/api/me`       | Bearer token | Returns the authenticated user (useful for testing the token). |

Password rules (enforced both client- and server-side): 8+ characters, at least one uppercase letter, one lowercase letter, and one digit.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` (`/login` and `/register`). Points at the backend on `http://localhost:5001/api` (see `src/api.js`).

## Notes

- Both dev servers need to be running at the same time for the UI to authenticate against the API.
- "Remember me" on the Login page controls whether the JWT is kept in `localStorage` (persists across browser restarts) or `sessionStorage` (cleared when the tab closes).
- This bundle is self-contained and does not share a database or backend with `components/login-signup-mysql-otp/`.
