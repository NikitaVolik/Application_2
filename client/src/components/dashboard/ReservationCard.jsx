// client/src/components/dashboard/ReservationCard.jsx

import { formatDateRu } from "../../utils/date.js"
import ReviewForm from "./ReviewForm.jsx"

function getStatusClass(status) {
  if (status === 'Новая') return 'status-badge status-new'
  if (status === 'Банкет назначен') return 'status-badge status-assigned'
  if (status === 'Банкет завершен') return 'status-badge status-completed'
  return 'status-badge'
}

export default function ReservationCard({ reservation, token, onReviewSaved }) {
    const item = reservation
    const venueName = item.venueName || item.venueId?.name
    const venueType = item.venueType || item.venueId?.type
    const canReview = item.status === 'Банкет завершен'
    const hasReview = Boolean(item.review || item.reviewId || item.hasReview)
    const review = item.review || null

    return (
      <article className="reservation-card reservation-card-wide">
        <div className="reservation-card-top">
          <div>
            <p className="card-eyebrow">{venueType}</p>
            <h3>{venueName}</h3>
          </div>
          <span className={getStatusClass(item.status)}>{item.status}</span>
        </div>

        <div className="reservation-info-grid">
          <p><strong>Дата банкета:</strong> {formatDateRu(item.eventDate)}</p>
          <p><strong>Дата бронирования:</strong> {formatDateRu(item.reservationDate)}</p>
          <p><strong>Способ оплаты:</strong> {item.paymentMethod}</p>
        </div>

        {hasReview && review ? (
          <div className="review-block review-result">
            <p><strong>Оценка:</strong> {item.review.rating}/5</p>
            <p><strong>Комментарий:</strong> {item.review.comment}</p>
          </div>
        ) : null}

        {canReview && !hasReview ? (
          <ReviewForm
            reservationId={item.id}
            token={token}
            onSaved={onReviewSaved}
          />
        ) : null}
      </article>
    )
}