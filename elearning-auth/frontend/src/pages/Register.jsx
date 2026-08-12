import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"

import api from "../api"
import AuthShell from "../components/AuthShell"
import AuthField from "../components/AuthField"
import { EMAIL_RE, USERNAME_RE, passwordIssues } from "../utils/validation"
import registerPhoto from "../assets/register-photo.jpg"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address"
    if (!USERNAME_RE.test(form.username.trim()))
      next.username = "3-30 characters: letters, numbers, _ or ."
    const pwIssues = passwordIssues(form.password)
    if (pwIssues.length) next.password = `Password needs ${pwIssues.join(", ")}`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    try {
      setLoading(true)
      await api.post("/register", {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 1600)
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      active="register"
      photo={registerPhoto}
      heading="Start Your Journey"
      subheading="Create a free account and get access to expert-led courses."
      tagline="Welcome to Skilline!"
      description="Create an account to start learning with expert instructors."
    >
      {success ? (
        <div className="rounded-2xl border border-[#49bbbd]/40 bg-[#49bbbd]/10 p-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[#49bbbd]" />
          <p className="text-[17px] font-semibold text-black">Account created!</p>
          <p className="mt-1 text-sm text-[#5b5b5b]">Taking you to the login page…</p>
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
            label="Email Address"
            type="email"
            placeholder="Enter your Email Address"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
            autoComplete="email"
          />

          <AuthField
            label="User name"
            placeholder="Enter your User name"
            value={form.username}
            onChange={update("username")}
            error={errors.username}
            autoComplete="username"
          />

          <AuthField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            autoComplete="new-password"
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-[49px] w-full sm:w-[232px] rounded-full bg-[#49bbbd] text-[16px] font-medium text-white transition hover:bg-[#3fa5a7] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
