// client/src/components/admin/VenueManager.jsx

import { useEffect, useState } from "react"
import venueService from "../../services/venueService.js"

const venueTypeOptions = ['Зал', 'Ресторан', 'Летняя веранда', 'Закрытая веранда']

export default function VenueManager({ token }) {
    const [venues, setVenues] = useState([])
    const [venueForm, setVenueForm] = useState({
      name: '',
      type: venueTypeOptions[0]
    })
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [venueSubmitting, setVenueSubmitting] = useState(false)
    const [deletingVenueId, setDeletingVenueId] = useState(null)

    useEffect(() => {
      let ignore = false

      async function loadVenues() {
        try {
          setError('')

          const data = await venueService.getAll(token)
          const items = Array.isArray(data) ? data : data?.items || []

          if (!ignore) {
            setVenues(items)
          }

        } catch (err) {
          if (!ignore) {
            setError(err.message || 'Не удалось загрузить помещения')
          }
        }
      }

      if (token) {
        loadVenues()
      } else {
        setVenues([])
      }

      return () => {
        ignore = true
      }
    }, [token])

    const handleVenueFormChange = (event) => {
      const { name, value } = event.target

      setVenueForm((prev) => ({
        ...prev,
        [name]: value
      }))

      setError('')
      setMessage('')
    }

    const handleVenueCreate = async (event) => {
      event.preventDefault()
      
      const payload = {
        name: venueForm.name.trim(),
        type: venueForm.type
      }

      if (!payload.name || !payload.type) {
        setError('Заполните данные помещения')
        return
      }

      try {
        setVenueSubmitting(true)
        setError('')
        setMessage('')

        const data = await venueService.create(payload, token)
        const createdVenue = data.venue

        setVenues((prev) => [...prev, createdVenue].sort((a, b) => a.name.localeCompare(b.name, 'ru')))

        setVenueForm({
          name: '',
          type: venueTypeOptions[0]
        })

        setMessage(data.message || 'Помещение добавлено')
      } catch (err) {
        setError(err.message || 'Не удалось добавить помещение')
      } finally {
        setVenueSubmitting(false)
      }
    }

    const handleVenueDelete = async (id) => {
      const confirmed = window.confirm('Удалить помещение')
      if (!confirmed) return

      try {
        setDeletingVenueId(id)
        setError('')
        setMessage('')

        const data = await venueService.remove(id, token)

        setVenues((prev) => prev.filter((item) => item.id !== id))
        setMessage(data.message || 'Помещение удалено')
      } catch (err) {
        setError(err.message || 'Не удалось удалить помещение')
      } finally {
        setDeletingVenueId(false)
      }
    }

    return (
      <section className="form-card admin-toolbar" aria-labelledby="venueManageTitle">
        <h2 id="venueManageTitle" className="section-title">Управление помещениями</h2>

          <form onSubmit={handleVenueCreate}>
            <div className="admin-toolbar-grid">
              <label className="field">
                <span>Название помещения</span>
                <input
                  type="text"
                  name="name"
                  value={venueForm.name}
                  onChange={handleVenueFormChange}
                  placeholder="Введите название помещения"
                  required
                />
              </label>

              <label className="field">
                <span>Сортировка по дате</span>
                <select
                  name="type"
                  value={venueForm.type}
                  onChange={handleVenueFormChange}
                >
                  {venueTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="btn" disabled={venueSubmitting}>
              {venueSubmitting ? "Добавление..." : "Добавить помещение"}
            </button>
          </form>

        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="form-message">{message}</p> : null}

        <div className="cards">
          {venues.length === 0 ? (
            <article className="empty-card">
              <h3>Помещений пока нет</h3>
              <p>Добавьте первое помещение через форму выше.</p>
            </article>
          ) : (
            venues.map((venue) => (
              <article className="admin-card" key={venue.id}>
                <div className="reservation-card-top">
                  <div>
                    <p className="card-eyebrow">{venue.type}</p>
                    <h3>{venue.name}</h3>
                  </div>
                </div>

                <div className="status-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleVenueDelete(venue.id)}
                    disabled={deletingVenueId === venue.id}
                  >
                    {deletingVenueId === venue.id ? "Удаление..." : "Удалить помещение"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    )
}