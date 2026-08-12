import { useState } from "react"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"

import api, { setToken, clearToken } from "../api"
import AuthShell from "../components/AuthShell"
import AuthField from "../components/AuthField"
import loginPhoto from "../assets/login-photo.jpg"

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.identifier.trim()) next.identifier = "Username or email is required"
    if (!form.password) next.password = "Password is required"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    try {
      setLoading(true)
      const res = await api.post("/login", {
        username: form.identifier.trim(),
        email: form.identifier.trim(),
        password: form.password,
      })
      setToken(res.data.access_token, remember)
      setSession(res.data.user)
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout")
    } finally {
      clearToken()
      setSession(null)
      setForm({ identifier: "", password: "" })
    }
  }

  return (
    <AuthShell
      active="login"
      photo={loginPhoto}
      heading="Learn Without Limits"
      subheading="Join thousands of learners building real skills with Skilline."
      tagline="Welcome to Skilline!"
      description="Sign in to continue learning and pick up right where you left off."
    >
      {session ? (
        <div className="rounded-2xl border border-[#49bbbd]/40 bg-[#49bbbd]/10 p-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[#49bbbd]" />
          <p className="text-[17px] font-semibold text-black">Welcome back, {session.username}!</p>
          <p className="mt-1 text-sm text-[#5b5b5b]">You're signed in as {session.email}.</p>
          <button
            onClick={handleLogout}
            className="mt-5 h-[44px] w-full rounded-full border border-[#49bbbd] text-[15px] font-medium text-[#49bbbd] transition hover:bg-[#49bbbd] hover:text-white"
          >
            Log out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {serverError && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <AuthField
            label="User name"
            placeholder="Enter your User name"
            value={form.identifier}
            onChange={update("identifier")}
            error={errors.identifier}
            autoComplete="username"
          />

          <AuthField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            autoComplete="current-password"
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-[#acacac] hover:text-[#49bbbd]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-[12px] text-black">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-[15px] w-[15px] rounded-sm border-black accent-[#49bbbd]"
              />
              Remember me
            </label>
            <button type="button" className="hover:text-[#49bbbd] hover:underline">
              Forgot Password ?
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-[49px] w-full sm:w-[232px] rounded-full bg-[#49bbbd] text-[16px] font-medium text-white transition hover:bg-[#3fa5a7] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
