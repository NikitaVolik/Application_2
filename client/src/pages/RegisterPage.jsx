// client/src/pages/RegisterPage.jsx

import "../styles/auth.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/layout/Layout.jsx"
import authService from "../services/authService.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    login: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    email: ''
  })

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))

    setError('')
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const payload = {
      login: form.login.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim()
    }

    if (!payload.login || !payload.password || !payload.fullName || !payload.phoneNumber || !payload.email) {
      setError('Заполните все поля')
      return
    }

    try {
      setIsSubmitting(false)

      const data = await authService.register(payload)

      login({ token: data.token, user: data.user })
      setMessage(data.message || 'Регистрация выполнена успешно')

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <main className="container" tabIndex="-1">
        <section className="hero" aria-labelledby="registerTitle">
          <h1 id="registerTitle">Регистрация</h1>
          <p>Создавайте аккаунт, чтобы бронировать и отслеживать свои заявки.</p>
        </section>

        <section className="form-card" aria-labelledby="Форма регистрации">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login">
                <span>Логин</span>
                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="Придумайте логин"
                  required
                />
              </label>
            </div>

            <div className="field">
              <label htmlFor="password">
                <span>Пароль</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Придумайте пароль"
                  required
                />
              </label>
            </div>

            <div className="field">
              <label htmlFor="fullName">
                <span>ФИО</span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Введите ФИО"
                  required
                />
              </label>
            </div>

            <div className="field">
              <label htmlFor="phoneNumber">
                <span>Телефон</span>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+7XXXXXXXXXX"
                  required
                />
              </label>
            </div>

            <div className="field">
              <label htmlFor="email">
                <span>Email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Введите email"
                  required
                />
              </label>
            </div>

            {error ? <p className="form-error">{error}</p> : null}
            {message ? <p className="form-message">{message}</p> : null}

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </button>

            <p className="form-note">
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </form>
        </section>
      </main>
    </Layout>
  )
}