// client/src/components/dashboard/DashboardStats.jsx

export default function DashboardStats({ reservations }) {
    const activeCount = reservations.filter(
        (item) => item.status === 'Банкет назначен'
    ).length

    const completedCount = reservations.filter(
        (item) => item.status === 'Банкет завершен'
    ).length

    return (
      <section className="dashboard-stats" aria-label="Статистика пользователя">
        <article className="stat-card">
          <span className="stat-label">Всего заявок</span>
          <strong className="stat-value">{reservations.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Назначенные</span>
          <strong className="stat-value">{activeCount}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Завершённые</span>
          <strong className="stat-value">{completedCount}</strong>
        </article>
      </section>
    )
}