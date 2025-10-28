import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

// Definisco quanti elementi per pagina voglio mostrare (lato client)
const ITEMS_PER_PAGE = 10;

function PacksPage() {
    const [packs, setPacks] = useState([]); // Contiene TUTTI i dati caricati dal server
    const [loading, setLoading] = useState(true);
    // Stato per la paginazione. Inizializzo a 1.
    const [currentPage, setCurrentPage] = useState(1);
    
    // Lo stato 'pages' non serve più direttamente nel componente, 
    // il totale delle pagine sarà calcolato in base alla lunghezza di packsToDisplay
    
    // Carica impostazioni salvate da sessionStorage
    const [searchTerm, setSearchTerm] = useState(() => {
        return sessionStorage.getItem('mtg_searchTerm') || "";
    });
    const [sortBy, setSortBy] = useState(() => {
        return sessionStorage.getItem('mtg_sortBy') || "released_at_desc";
    });

    
    function fetchPacks() {
        setLoading(true);
        // Chiamata per recuperare TUTTI i set, gestendo filtro/ordinamento/paginazione lato client
        axios
            .get("http://localhost:3000/set")
            .then((response) => {
                // Assumo che response.data.sets contenga l'array di tutti i set
                // Ho fatto una piccola correzione qui per gestire response.data o response.data.sets
                const allSets = response.data.sets || response.data || [];
                setPacks(allSets);
                // Resetto la pagina corrente a 1 dopo il caricamento completo
                setCurrentPage(1); 
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching packs:", error);
                setLoading(false);
            });
    }

    function handleSearchChange(e) {
        const value = e.target.value;
        setSearchTerm(value);
        sessionStorage.setItem('mtg_searchTerm', value);
        // IMPORTANTE: Quando l'utente cerca, si torna alla prima pagina.
        setCurrentPage(1); 
    }

    function handleSortChange(e) {
        const value = e.target.value;
        setSortBy(value);
        sessionStorage.setItem('mtg_sortBy', value);
        // IMPORTANTE: Quando l'ordinamento cambia, si torna alla prima pagina.
        setCurrentPage(1);
    }

    // NUOVA FUNZIONE: Gestisce il cambio di pagina.
    function handlePageChange(newPage) {
        setCurrentPage(newPage);
        // Scorri in alto per un'esperienza utente migliore
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        fetchPacks();
    }, []);


    // USES MEMO PER FILTRO, ORDINAMENTO E PAGINAZIONE
    // Questo è il blocco corretto e completo.
    const { packsToDisplay, totalFilteredPages, totalFilteredPacks } = useMemo(() => {
        // La variabile 'packs' può essere un array diretto o contenere l'array in 'packs.sets'
        const packsArray = Array.isArray(packs) ? packs : (packs.sets || []);

        // 1. Filtro (si applica a tutti i pacchetti)
        const filteredPacks = packsArray.filter((pack) =>
            pack.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // 2. Ordinamento (si applica ai pacchetti filtrati)
        const sortedPacks = filteredPacks.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "name_asc") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === "name_desc") {
                comparison = b.name.localeCompare(a.name);
            } else if (sortBy === "released_at_desc") {
                comparison = new Date(b.released_at) - new Date(a.released_at);
            } else if (sortBy === "released_at_asc") {
                comparison = new Date(a.released_at) - new Date(b.released_at);
            }

            return comparison;
        });

        // 3. Paginazione (si applica ai pacchetti filtrati e ordinati)
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        const packsForCurrentPage = sortedPacks.slice(startIndex, endIndex);

        const totalPages = Math.ceil(filteredPacks.length / ITEMS_PER_PAGE);

        return { 
            packsToDisplay: packsForCurrentPage, 
            totalFilteredPages: totalPages,
            totalFilteredPacks: filteredPacks.length
        };
        
    }, [packs, searchTerm, sortBy, currentPage]); // Dipendenze: si aggiorna al cambio di pagina

    // Logica per i pulsanti di paginazione (visualizzazione compatta)
    const getPageNumbers = () => {
        const totalPages = totalFilteredPages;
        const maxPagesToShow = 5;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const halfMax = Math.floor(maxPagesToShow / 2);
            
            if (currentPage <= halfMax) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + halfMax >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - halfMax;
                endPage = currentPage + halfMax;
            }
        }
        
        // Previene che startPage sia minore di 1 se totalPages è piccolo
        if (startPage < 1) startPage = 1;

        const pages = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);
        
        return { 
            pages, 
            showStartEllipsis: startPage > 1, 
            showEndEllipsis: endPage < totalPages 
        };
    };
    
    const { pages, showStartEllipsis, showEndEllipsis } = getPageNumbers();


    return (
        <>
            <div className="page-header">
                <Link to="/" className="btn btn-outline-light back-button">
                    <span>← Torna alla Home</span>
                </Link>
                <h1>Scegli il tuo pacchetto</h1>
            </div>

            {/* CONTROLLI: Ricerca + Select per Ordinamento */}
            <div className="controls-container d-flex flex-column align-items-center gap-3">
                <input
                    type="text"
                    placeholder="Cerca per nome del pacchetto..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control custom-input"
                />
                
                {/* SELECT PER ORDINAMENTO */}
                <div className="sort-buttons-group d-flex gap-2 flex-wrap justify-content-center">
                    <span className="text-white align-self-center d-none d-sm-block sort-label">Ordina per:</span>
                    
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="form-select custom-select" // Uso una classe per lo stile
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
                    {/* Contenitore per le card */}
                    <div className="packs-grid d-flex flex-wrap justify-content-center gap-4">
                        {packsToDisplay.map((pack) => (
                            // Rimosso stile in linea, uso classi
                            <div key={pack.id} className="card pack-card"> 
                                <h2>{pack.name}</h2>
                                <p>Code: {pack.code}</p>
                                <img
                                    src={pack.icon_svg_uri}
                                    alt={pack.name}
                                    style={{ maxWidth: "6rem" }} // Dimensione icona
                                />
                                <p>Release Date: {pack.released_at}</p>
                                <Link className="btn btn-success" to={`/packs/${pack.code}`}>
                                    🎲 Apri pacchetto
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    {packsToDisplay.length === 0 && (
                        <div className="text-center text-white mt-5">
                            <p style={{ fontSize: "1.2rem" }}>Nessun pacchetto trovato con i criteri attuali.</p>
                        </div>
                    )}
                </>
            )}

            {/* PAGINAZIONE - Fuori dal blocco loading e solo se ci sono pagine da mostrare */}
            {!loading && totalFilteredPacks > ITEMS_PER_PAGE && (
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
                        
                        {pages.map(page => (
                            <button
                                key={page}
                                className={`btn btn-sm pagination-page-btn ${page === currentPage ? 'btn-success pagination-active' : 'btn-outline-light'}`}
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
            )}
        </>
    );
}

export default PacksPage;
