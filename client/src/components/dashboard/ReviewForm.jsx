// client/src/components/dashboard/ReviewForm.jsx

import { useState } from "react"
import reviewService from "../../services/reviewService.js"

export default function ReviewForm({ reservationId, token, onSaved }) {
    const [rating, setRating] = useState('5')
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
      event.preventDefault()

      const trimmedComment = comment.trim()
      const numericRating = Number(rating)

      setError('')
      setMessage('')

      try {
        setIsSubmitting(true)

        const data = await reviewService.create(
          {
            reservationId,
            rating: numericRating,
            comment: trimmedComment
          },
          token
        )

        const savedReview = data.review || {
          reservationId,
          rating: numericRating,
          comment: trimmedComment
        }

        setMessage(data.message || 'Отзыв сохранён')
        onSaved(reservationId, savedReview)
      } catch (err) {
        setError(err.message || 'Не удалось сохранить отзыв')
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <form className="review-block" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor={`review-rating-${reservationId}`}>
            <span>Оценка</span>
          </label>
          <select
            id={`review-rating-${reservationId}`}
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            disabled={isSubmitting}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor={`review-text-${reservationId}`}>
            <span>Комментарий</span>
          </label>
          <textarea
            id={`review-text-${reservationId}`}
            placeholder="Поделитесь впечатлениями"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value),
              setError('')
              setMessage('')
            }}
            disabled={isSubmitting}
            minLength={3}
            maxLength={1000}
            required
          />

          {error ? <p className="form-error">{error}</p> : null}
          {message ? <p className="form-message">{message}</p> : null}

          <button
            type="submit"
            className="btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить отзыв"}
          </button>
        </div>
      </form>
    )
}