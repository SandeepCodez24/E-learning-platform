export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_RE = /^[a-zA-Z0-9_.]{3,30}$/

export function passwordIssues(password) {
  const issues = []
  if (password.length < 8) issues.push("at least 8 characters")
  if (!/[A-Z]/.test(password)) issues.push("an uppercase letter")
  if (!/[a-z]/.test(password)) issues.push("a lowercase letter")
  if (!/\d/.test(password)) issues.push("a number")
  return issues
}
