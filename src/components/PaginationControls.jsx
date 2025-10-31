function PaginationControls({
  loading,
  totalFilteredPacks,
  itemsPerPage,
  currentPage,
  totalFilteredPages,
  handlePageChange,
  getPageNumbers,
}) {
  // Mostra i controlli SOLO se ci sono più pacchetti di quelli visualizzati su una pagina
  if (loading || totalFilteredPacks <= itemsPerPage) {
    return null;
  }

  const { pages, showStartEllipsis, showEndEllipsis } = getPageNumbers();

  return (
    <div className="pagination-container">
      {/* Controlli Precedente/Successiva */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-3 flex-wrap">
        <button
          className="btn btn-outline-light pagination-nav-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Precedente
        </button>

        <span className="text-white page-status-text">
          Pagina {currentPage} di {totalFilteredPages}
        </span>

        <button
          className="btn btn-outline-light pagination-nav-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalFilteredPages}
        >
          Successiva →
        </button>
      </div>

      {/* Numeri di pagina cliccabili */}
      <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
        {showStartEllipsis && (
          <>
            <button
              className="btn btn-sm btn-outline-light pagination-page-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            <span className="text-white ellipsis-text">...</span>
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            className={`btn btn-sm pagination-page-btn ${
              page === currentPage
                ? "btn-success pagination-active"
                : "btn-outline-light"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {showEndEllipsis && (
          <>
            <span className="text-white ellipsis-text">...</span>
            <button
              className="btn btn-sm btn-outline-light pagination-page-btn"
              onClick={() => handlePageChange(totalFilteredPages)}
            >
              {totalFilteredPages}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaginationControls;