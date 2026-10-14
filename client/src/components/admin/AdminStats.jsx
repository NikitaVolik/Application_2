// client/src/components/admin/AdminStats.jsx

export default function AdminStats({ reservations }) {
    const newCount = reservations.filter(
        (item) => item.status === 'Новая'
    ).length

    const completedCount = reservations.filter(
        (item) => item.status === 'Банкет завершен'
    ).length

    return (
      <section className="dashboard-stats" aria-label="Статистика заявок">
        <article className="stat-card">
          <span className="stat-label">Всего заявок</span>
          <strong className="stat-value">{reservations.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Новые</span>
          <strong className="stat-value">{newCount}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Завершённые</span>
          <strong className="stat-value">{completedCount}</strong>
        </article>
      </section>
    )
}