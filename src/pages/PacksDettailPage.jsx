// Rimosse le importazioni non necessarie: useEffect, useState, useCallback
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useOpen from "../hook/useOpen"; // Importa il custom hook


// --- Sottocomponente per la Carta con Effetto Flip ---
const CardFlip = ({ carta, index }) => {
    // useState è necessario solo qui, all'interno del sottocomponente.
    const [isFlipped, setIsFlipped] = useState(false);
    const isFoil = carta.foil === true;

    const handleFlip = () => {
        if (!isFlipped) {
            setIsFlipped(true);
        }
    };

    // Aggiungiamo le classi di rarità e foil al card-container
    const cardRarityClass = `rarity-${carta.rarity?.toLowerCase()}`;
    const foilContainerClass = isFoil ? 'foil-card' : '';

    const backImageUrl = "https://i.imgur.com/LdOBU1I.jpeg";
    const imageUrl = Array.isArray(carta.immagineUrl) ? carta.immagineUrl[0] : carta.immagineUrl;


    return (
        <div
            className={`card-container ${cardRarityClass} ${foilContainerClass}`} // Classi CSS personalizzate
            onClick={handleFlip}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="card-scale-wrapper">
                <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>

                    {/* Faccia POSTERIORE */}
                    <div className="card-face card-back">
                        <img
                            src={backImageUrl}
                            alt="Retro della Carta"
                            className="card-back-image"
                            onError={(e) => { e.target.src = "https://placehold.co/150x210/1f2937/fff?text=Retro+Pack"; }}
                        />
                    </div>

                    {/* Faccia ANTERIORE */}
                    <div className="card-face card-front position-relative"> {/* Bootstrap: position-relative */}
                        <Link to={`/packs/${carta.set_code}/${encodeURIComponent(carta.nome)}`}>
                            <img
                                src={imageUrl}
                                alt={carta.nome}
                                className="img-fluid rounded border border-secondary" // Bootstrap
                                style={{ width: "100%", aspectRatio: "1/1.4" }}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x210/606060/FFFFFF?text=Card"; }}
                            />

                            {/* Contenitore per i badge del prezzo e foil */}
                            <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between align-items-start" style={{ zIndex: 10 }}>

                                {/* BADGE FOIL (Arcobaleno) */}
                                {isFoil && (
                                    <span className="foil-badge badge rounded-pill shadow">
                                        FOIL
                                    </span>
                                )}

                                {/* BADGE PREZZO */}
                                {carta.price && carta.price !== 'N/A' ? (
                                    <span className="price-badge badge rounded-pill bg-success text-dark shadow ms-auto">
                                        € {carta.price}
                                    </span>
                                ) : (
                                    <span className="price-badge badge rounded-pill bg-secondary text-white shadow ms-auto">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- Fine CardFlip Component ---


function PacksDettail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    // 🎣 Sostituisci useState e useEffect per il fetch con il custom hook
    const { data, loading, fetchPack } = useOpen(slug);

    const handleOpenAnother = () => {
        // Chiama la funzione fornita dal custom hook per rifare il fetch
        fetchPack();
    };

    const handleGoBack = () => {
        navigate('/packs');
    };

    return (
        <div className="container min-vh-100 text-white p-4 p-sm-5">

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 bg-secondary p-3 rounded shadow">
                <h1 className="h4 mb-3 mb-sm-0">Pacchetto aperto: {data.set_code || slug?.toUpperCase()}</h1>
                <div className="d-flex action-buttons">
                    <button
                        className="btn btn-action btn-go-back me-2"
                        onClick={handleGoBack}
                    >
                        <span className="me-2">←</span> Scegli altro pacchetto
                    </button>
                    <button
                        className="btn btn-action btn-open-pack"
                        onClick={handleOpenAnother}
                        disabled={loading}
                    >
                        🎲 Apri un altro {data.set_code || slug?.toUpperCase()}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="mtg-spinner-container">
                    <div className="mtg-spinner">
                        <div className="mana-symbol">✦</div>
                    </div>
                    <p className="loading-text">Aprendo il pacchetto...</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {data.contents && data.contents.map((carta, index) => (
                        <CardFlip key={index} carta={carta} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PacksDettail;