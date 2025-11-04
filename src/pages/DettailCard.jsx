import { useParams, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { useContext, useState } from "react";

function DettailCard() {

    const { detail } = useContext(GlobalContext);
    const { slug } = useParams();
    const navigate = useNavigate();

    // Stato per la visualizzazione della carta bifronte
    const [isFlippedLocal, setIsFlippedLocal] = useState(false);

    // Determina se la carta è una carta bifronte (ha card_faces)
    const isTransformCard = detail?.data?.card_faces && detail.data.card_faces.length === 2;

    // Funzione per gestire il tasto "Torna Indietro"
    const handleGoBack = () => {
        navigate(`/packs/${slug}`);
    };

    // Funzione per capovolgere la carta (solo se è bifronte)
    const handleFlipCard = () => {
        if (isTransformCard) {
            setIsFlippedLocal(prev => !prev);
        }
    };

    console.log("DettailCard detail state:", detail);

    // Gestione stato non trovato
    if (!detail || Object.keys(detail).length === 0) {
        return (
            <div className="container min-vh-100 text-white p-4 p-sm-5 text-center">
                <h1 className="text-danger">Dettagli Carta Non Trovati.</h1>
                <p>Torna al pacchetto per visualizzare le informazioni.</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/packs/${slug}`)}
                >
                    <span className="me-2">←</span> Torna al pacchetto
                </button>
            </div>
        );
    }

    // Funzione per estrarre i dati della faccia corrente (fronte o retro)
    const getCurrentFaceData = () => {
        if (!isTransformCard) {
            return detail.data || {};
        }

        const faceIndex = isFlippedLocal ? 1 : 0;
        const currentFace = detail.data.card_faces[faceIndex];

        // Estrai l'immagine corretta dall'array 'immagineUrl' di livello superiore
        const faceImageUrl = Array.isArray(detail.immagineUrl) && detail.immagineUrl.length > 1
            ? detail.immagineUrl[faceIndex]
            : detail.immagineUrl;

        return {
            ...detail.data,
            nome: currentFace.name,
            type_line: currentFace.type_line,
            oracle_text: currentFace.oracle_text,
            flavor_text: currentFace.flavor_text,
            artist: currentFace.artist,
            imageUrl: faceImageUrl,
            cardText: currentFace.oracle_text || currentFace.card_text
        };
    };

    const currentFaceData = getCurrentFaceData();

    // Estrai i dati necessari
    const cardName = decodeURIComponent(currentFaceData.nome || detail.nome || '');

    // Gestione di imageUrl (gestisce array con 1 o 2 elementi)
    const sourceImageUrl = currentFaceData.imageUrl || detail.immagineUrl;

    const imageUrl = Array.isArray(sourceImageUrl)
        ? sourceImageUrl[isTransformCard && isFlippedLocal ? 1 : 0]
        : sourceImageUrl;

    const rarityClass = `card-detail-rarity-${detail.rarity?.toLowerCase()}`;

    // LOGICA PREZZO
    let priceClass = "bg-secondary text-white";
    const priceText = detail.price && detail.price !== "N/A" ? `€ ${detail.price}` : "N/A";

    if (detail.price && detail.price !== "N/A") {
        const priceValue = parseFloat(detail.price.replace('€', '').trim());

        if (priceValue > 10) {
            priceClass = 'price-high';
        } else if (priceValue >= 1) {
            priceClass = 'price-medium';
        } else {
            priceClass = 'price-low';
        }
    }


    // Funzione per gestire le interruzioni di riga nel testo oracolare
    const formatOracleText = (text) => {
        let formattedText = text.replace(/\{(\w+)\}/g, '[$1]');

        return formattedText.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
        ));
    };

    // Se oracle_text della faccia non è presente, usa card_text per il display
    const cardText = currentFaceData.oracle_text || currentFaceData.card_text;

    return (
        <div className="container min-vh-100 text-white p-4 p-sm-5 card-detail-page">

            <div className="d-flex justify-content-center w-100 mb-4" style={{ maxWidth: '900px' }}>
                <button
                    className="btn btn-primary"
                    onClick={handleGoBack}
                >
                    <span className="me-2">←</span> Torna al Pacchetto
                </button>
            </div>

            <div className="card-detail-wrapper">

                {/* Contenitore Immagine con Posizionamento Relativo per il Badge */}
                <div className="card-detail-image-container position-relative">

                    {isTransformCard && (
                        <button
                            className="flip-card-badge position-absolute flip-badge-position"
                            onClick={handleFlipCard}
                            style={{ zIndex: 10 }}
                        >
                            {isFlippedLocal ? (
                                <>
                                    <span className="flip-icon">⟲</span>
                                    <span>FRONTE</span>
                                </>
                            ) : (
                                <>
                                    <span className="flip-icon">⟳</span>
                                    <span>RETRO</span>
                                </>
                            )}
                        </button>
                    )}

                    <img
                        src={imageUrl}
                        alt={cardName}
                        className="card-detail-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/350x490/606060/FFFFFF?text=Card+Details";
                        }}
                    />
                </div>

                {/* Colonna Info */}
                <div className="card-detail-info">
                    <h1 className="card-detail-name">{cardName}</h1>

                    {/* Metadati (Rarità, Prezzo, Set) */}
                    <div className="card-detail-meta">
                        <div className={`card-detail-meta-item ${rarityClass}`}>
                            Rarità: {detail.rarity?.toUpperCase()}
                        </div>
                        <div className={`card-detail-meta-item ${priceClass}`}>
                            Prezzo: {priceText}
                        </div>
                        <div className="card-detail-meta-item">
                            Set: {detail.data?.set_name || 'Sconosciuto'}
                        </div>
                    </div>

                    <h3 className="card-detail-type mt-4">
                        {currentFaceData.type_line || 'Tipo non disponibile'}
                    </h3>

                    {/* Testo Oracolo/Effetti */}
                    {cardText && (
                        <div className="card-detail-section">
                            <h4>Testo della Carta</h4>
                            <div className="card-detail-text">
                                {formatOracleText(cardText)}
                            </div>
                        </div>
                    )}

                    {/* Testo di colore/Flavor Text */}
                    {currentFaceData.flavor_text && (
                        <div className="card-detail-section">
                            <h4>Testo di Colore</h4>
                            <p className="card-detail-text fst-italic">
                                {currentFaceData.flavor_text}
                            </p>
                        </div>
                    )}

                    {/* Artista */}
                    {currentFaceData.artist && (
                        <div className="card-detail-section">
                            <h4>Artista</h4>
                            <p className="card-detail-text">
                                {currentFaceData.artist}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DettailCard;