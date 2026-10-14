// client/src/pages/DashboardPage.jsx

import "../styles/dashboard.css"
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout.jsx"
import HeroSlider from "../components/common/HeroSlider.jsx"
import DashboardStats from "../components/dashboard/DashboardStats.jsx"
import ReservationCard from "../components/dashboard/ReservationCard.jsx"
import useMyReservations from "../hooks/useMyReservations.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function DashboardPage() {
  const { token } = useAuth()
  const { reservations, setReservations, error } = useMyReservations(token)

  const handleReviewSaved = (reservationId, review) => {
    setReservations((prev) =>
      prev.map((item) =>
        item.id === reservationId
          ? {
              ...item,
              hasReview: true,
              reviewId: review.id || reservationId,
              review
            }
          : item
      )
    )
  }

  return (
    <Layout>
      <HeroSlider />

      <main className="container" tabIndex="-1">
        <section className="hero" aria-labelledby="dashboardTitle">
          <h1 id="dashboardTitle">Личный кабинет</h1>
          <p>Ваши заявки и отзывы по завершённым банкетам.</p>
        </section>

        <DashboardStats reservations={reservations} />

        {error ? <p className="form-error">{error}</p> : null}

        <section className="cards" aria-labelledby="reservationsTitle">
          <h2 id="reservationsTitle" className="section-title">Мои заявки</h2>

          {reservations.length === 0 ? (
            <article className="empty-card">
              <h3>Заявок пока нет</h3>
              <p>Оформите первую бронь помещения.</p>
              <Link to="/reservation" className="btn">
                Перейти к бронированию
              </Link>
            </article>
          ) : (
            reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                token={token}
                onReviewSaved={handleReviewSaved}
              />
            ))
          )}
        </section>
      </main>
    </Layout>
  )
}