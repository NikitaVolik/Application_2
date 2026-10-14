// client/src/components/admin/ReservationFilters.jsx

const statusOptions = ['Новая', 'Банкет назначен', 'Банкет завершен']

export default function ReservationFilters({ status, sortDirection, onStatusChange, onSortChange }) {
    return (
      <section className="form-card admin-toolbar" aria-label="Фильтрация заявок">
        <div className="admin-toolbar-grid">
          <label className="field">
            <span>Фильтр по статусу</span>
            <select
              value={status}
              onChange={(event) => {onStatusChange(event.target.value)}}
            >
              <option value="">Все</option>
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Сортировка по дате</span>
            <select
              value={sortDirection}
              onChange={(event) => {onSortChange(event.target.value)}}
            >
              <option value="desc">Сначала ближайшие новые</option>
              <option value="asc">Сначала более ранние</option>
            </select>
          </label>
        </div>
      </section>
    )
}