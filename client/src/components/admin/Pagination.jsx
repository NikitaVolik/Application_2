// client/src/components/admin/Pagination.jsx

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
      return null
    }

    return (
      <section className="pagination" aria-label="Пагинация">
        <button
          type="button"
          className="btn"
          onClick={() => onPageChange((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Назад
        </button>

        <p>{currentPage} / {totalPages}</p>

        <button
          type="button"
          className="btn"
          onClick={() => onPageChange((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Вперёд
        </button>
      </section>
    )
}