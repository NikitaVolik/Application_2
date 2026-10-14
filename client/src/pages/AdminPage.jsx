// client/src/pages/AdminPage.jsx

import "../styles/admin.css"
import { useEffect, useMemo, useState } from "react"
import Layout from "../components/layout/Layout.jsx"
import AdminStats from "../components/admin/AdminStats.jsx"
import ReservationFilters from "../components/admin/ReservationFilters.jsx"
import VenueManager from "../components/admin/VenueManager.jsx"
import ReservationCard from "../components/admin/ReservationCard.jsx"
import Pagination from "../components/admin/Pagination.jsx"
import useAdminReservations from "../hooks/useAdminReservations.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function AdminPage() {
  const { token } = useAuth()

  const [statusFilter, setStatusFilter] = useState("")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const {
    reservations,
    draftStatuses,
    updateDraftStatus,
    saveStatus,
    error,
    message
  } = useAdminReservations(token, statusFilter)

  const pageSize = 4

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const first = String(a.eventDate)
      const second = String(b.eventDate)

      return sortDirection === "asc"
        ? first.localeCompare(second)
        : second.localeCompare(first)
    })
  }, [reservations, sortDirection])

  const totalPages = Math.max(
    1,
    Math.ceil(sortedReservations.length / pageSize)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedReservations = sortedReservations.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  )

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortDirection(value)
    setCurrentPage(1)
  }

  return (
    <Layout>
      <main className="container" tabIndex="-1">
        <section className="hero" aria-labelledby="adminTitle">
          <h1 id="adminTitle">Панель администратора</h1>
          <p>Просмотр заявок, фильтрация, изменение статусов и управление помещениями.</p>
        </section>

        <AdminStats reservations={reservations} />

        <ReservationFilters
          status={statusFilter}
          sortDirection={sortDirection}
          onStatusChange={handleStatusFilterChange}
          onSortChange={handleSortChange}
        />

        <VenueManager token={token} />

        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="form-message">{message}</p> : null}

        <section className="admin-list" aria-labelledby="adminListTitle">
          <h2 id="adminListTitle" className="section-title">Список заявок</h2>

          {paginatedReservations.length === 0 ? (
            <article className="empty-card">
              <h3>Заявок не найдено</h3>
              <p>По текущему фильтру записи отсутствуют.</p>
            </article>
          ) : (
            paginatedReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                draftStatus={draftStatuses[reservation.id] || ""}
                onDraftStatusChange={updateDraftStatus}
                onSaveStatus={saveStatus}
              />
            ))
          )}
        </section>

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </Layout>
  )
}