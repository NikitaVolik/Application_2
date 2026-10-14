// client/src/components/admin/ReservationCard.jsx

import { formatDateRu } from "../../utils/date.js"

function getStatusClass(status) {
  if (status === 'Новая') return 'status-badge status-new'
  if (status === 'Банкет назначен') return 'status-badge status-assigned'
  if (status === 'Банкет завершен') return 'status-badge status-completed'
  return 'status-badge'
}

function getNextStatuses(status) {
  if (status === 'Новая') return ['Банкет назначен']
  if (status === 'Банкет назначен') return ['Банкет завершен']
  return []
}

export default function ReservationCard({ reservation, draftStatus = '', onDraftStatusChange, onSaveStatus }) {
    const item = reservation
    const nextStatuses = getNextStatuses(item.status)
    const venueName = item.venueName || item.venueId?.name
    const venueType = item.venueType || item.venueId?.type

    return (
      <article className="admin-card">
        <div className="reservation-card-top">
          <div>
            <p className="card-eyebrow">{venueType}</p>
            <h3>{venueName}</h3>
          </div>
          <span className={getStatusClass(item.status)}>{item.status}</span>
        </div>

        <div className="reservation-info-grid">
          <p><strong>Клиент:</strong> {item.userId?.fullName || item.userFullName || item.userLogin}</p>
          <p><strong>Телефон:</strong> {item.userId?.phoneNumber || item.userPhoneNumber}</p>
          <p><strong>Email:</strong> {item.userId?.email || item.userEmail}</p>
          <p><strong>Дата банкета:</strong> {formatDateRu(item.eventDate)}</p>
          <p><strong>Способ оплаты:</strong> {item.paymentMethod}</p>
        </div>

        <div className="status-actions">
          <label className="field">
            <span>Новый статус</span>
            <select
              value={draftStatus}
              onChange={(event) => onDraftStatusChange(item.id, event.target.value)}
              disabled={nextStatuses.length === 0}
            >
              <option value="">
                {nextStatuses.length === 0 ? "Переходов нет" : "Выберите статус"}
              </option>
              {nextStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="btn"
            onClick={() => onSaveStatus(item.id, item.status)}
            disabled={nextStatuses.length === 0 || !draftStatus || draftStatus === item.status}
          >
            Сохранить статус
          </button>
        </div>
      </article>
    )
}