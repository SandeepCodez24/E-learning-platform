import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5001/api",
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function setToken(token, persist) {
  clearToken()
  ;(persist ? localStorage : sessionStorage).setItem("token", token)
}

export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token")
}

export function clearToken() {
  localStorage.removeItem("token")
  sessionStorage.removeItem("token")
}

export default api
