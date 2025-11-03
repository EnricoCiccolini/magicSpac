import { useParams, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { useContext } from "react";


function DettailCard() {

    // CORREZIONE: Usa 'detail' (singolare) come definito in App.jsx
    const { detail } = useContext(GlobalContext);
    const { slug } = useParams();
    const navigate = useNavigate();

    // Funzione per gestire il tasto "Torna Indietro"
    const handleGoBack = () => {
        navigate(`/packs/${slug}`);
    };
    
    // Se lo stato detail non è presente (e.g. accesso diretto all'URL)
    if (!detail || Object.keys(detail).length === 0) {
        return (
            <div className="container min-vh-100 text-white p-4 p-sm-5 text-center">
                <h1 className="text-danger">Dettagli Carta Non Trovati.</h1>
                <p>Torna al pacchetto per visualizzare le informazioni.</p>
                <button
                    className="btn btn-action btn-go-back"
                    onClick={() => navigate(`/packs/${slug}`)}
                >
                    <span className="me-2">←</span> Torna al pacchetto
                </button>
            </div>
        );
    }

    // Estrai i dati necessari
    const cardName = decodeURIComponent(detail.nome || '');
    const imageUrl = Array.isArray(detail.immagineUrl)
        ? detail.immagineUrl[0]
        : detail.immagineUrl;
    const rarityClass = `card-detail-rarity-${detail.rarity?.toLowerCase()}`;

    // LOGICA PREZZO: assegna la classe CSS in base al valore
    let priceClass = "bg-secondary text-white"; // Default fallback
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
        // Sostituisce i simboli di mana di Magic the Gathering (e.g. {U}, {R}, {T}) con un testo più leggibile o li rimuove per semplicità
        let formattedText = text.replace(/\{(\w+)\}/g, '[$1]'); 
        
        return formattedText.split('\\n').map((line, index) => (
            <p key={index}>{line}</p>
        ));
    };
    
    // Se oracle_text non è presente, usa card_text per il display
    const cardText = detail.data?.oracle_text || detail.data?.card_text;
    
    return (
        <div className="container min-vh-100 text-white p-4 p-sm-5 card-detail-page">
            
            <div className="d-flex justify-content-center w-100 mb-4" style={{maxWidth: '900px'}}>
                <button
                    className="btn btn-action btn-go-back"
                    onClick={handleGoBack}
                >
                    <span className="me-2">←</span> Torna al Pacchetto
                </button>
            </div>

            <div className="card-detail-wrapper">
                {/* Colonna Immagine */}
                <div className="card-detail-image-container">
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
                        {/* Applico la classe dinamica del prezzo qui */}
                        <div className={`card-detail-meta-item ${priceClass}`}>
                            Prezzo: {priceText}
                        </div>
                        <div className="card-detail-meta-item">
                            Set: {detail.data?.set_name || 'Sconosciuto'}
                        </div>
                    </div>

                    <h3 className="card-detail-type mt-4">
                        {detail.data?.type_line || 'Tipo non disponibile'}
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
                    {detail.data?.flavor_text && (
                        <div className="card-detail-section">
                            <h4>Testo di Colore</h4>
                            <p className="card-detail-text fst-italic">
                                {detail.data.flavor_text}
                            </p>
                        </div>
                    )}
                    
                    {/* Artista */}
                    {detail.data?.artist && (
                        <div className="card-detail-section">
                            <h4>Artista</h4>
                            <p className="card-detail-text">
                                {detail.data.artist}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DettailCard;