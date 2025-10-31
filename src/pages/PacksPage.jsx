import { Link } from "react-router-dom";
import { usePacks } from "../hook/usePacks";
import PackCard from "../components/PacksCard";
import PaginationControls from "./PaginationControls";

function PacksPage() {
  const {
    loading,
    searchTerm,
    sortBy,
    currentPage,
    packsToDisplay,
    totalFilteredPages,
    totalFilteredPacks,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    getPageNumbers,
    itemsPerPage,
  } = usePacks();

  return (
    <>
      <div className="page-header">
        <Link to="/" className="btn btn-outline-light back-button">
          <span>← Torna alla Home</span>
        </Link>
        <h1>Scegli il tuo pacchetto</h1>
      </div>

      {/* Controlli: Ricerca + Select per Ordinamento */}
      <div className="controls-container d-flex flex-column align-items-center gap-3">
        <input
          type="text"
          placeholder="Cerca per nome del pacchetto..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control custom-input"
        />

        <div className="sort-buttons-group d-flex gap-2 flex-wrap justify-content-center">
          <span className="text-white align-self-center d-none d-sm-block sort-label">
            Ordina per:
          </span>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="form-select custom-select"
          >
            <option value="released_at_desc">Data Uscita (Recenti) ⬇️</option>
            <option value="released_at_asc">Data Uscita (Meno Recenti) ⬆️</option>
            <option value="name_asc">Nome (A-Z) ⬆️</option>
            <option value="name_desc">Nome (Z-A) ⬇️</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mtg-spinner-container">
          <div className="mtg-spinner">
            <div className="mana-symbol">✦</div>
          </div>
          <p className="loading-text">Caricamento pacchetti...</p>
        </div>
      ) : (
        <>
          <PaginationControls
            loading={loading}
            totalFilteredPacks={totalFilteredPacks}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalFilteredPages={totalFilteredPages}
            handlePageChange={handlePageChange}
            getPageNumbers={getPageNumbers}
          />

          <div className="packs-grid">
            {packsToDisplay.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>

          {packsToDisplay.length === 0 && (
            <div className="text-center text-white mt-5">
              <p style={{ fontSize: "1.2rem" }}>
                Nessun pacchetto trovato con i criteri attuali.
              </p>
            </div>
          )}

          <PaginationControls
            loading={loading}
            totalFilteredPacks={totalFilteredPacks}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalFilteredPages={totalFilteredPages}
            handlePageChange={handlePageChange}
            getPageNumbers={getPageNumbers}
          />
        </>
      )}
    </>
  );
}

export default PacksPage;