import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// --- Sottocomponente per la Carta con Effetto Flip ---
const CardFlip = ({ carta, index }) => {
    // Stato locale per gestire se la carta è stata girata
    const [isFlipped, setIsFlipped] = useState(false);
    const isFoil = carta.slot && carta.slot.toLowerCase() === 'jolly';

    // Funzione che gestisce il click e gira la carta una sola volta
    const handleFlip = () => {
        if (!isFlipped) {
            setIsFlipped(true);
        }
    };

    const cardRarityClass = `rarity-${carta.rarity?.toLowerCase()}`;
    // Immagine placeholder per il retro della carta
    const backImageUrl = "https://i.imgur.com/LdOBU1I.jpeg";

    return (
        <div
            className="card-container"
            onClick={handleFlip}
            // Aggiunge un leggero ritardo all'ingresso della carta coperta
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={`card-inner ${isFlipped ? 'flipped' : ''} ${isFoil ? 'foil-card' : ''} ${cardRarityClass}`}>

                {/* Faccia POSTERIORE (Visibile inizialmente) */}
                <div className="card-face card-back">
                    <img
                        src={backImageUrl}
                        alt="Retro della Carta"
                        className="card-back-image"
                        onError={(e) => { e.target.src = "https://placehold.co/150x210/1f2937/fff?text=Retro+Pack"; }}
                    />
                </div>

                {/* Faccia ANTERIORE (Rivelata al click) */}
                <div className={`card-face card-front card-content`}>
                    {/* Contenuto originale della carta */}
                    {/* <h3 className="text-lg font-semibold text-gray-100">{carta.nome}</h3>
                    <p className="text-sm text-gray-400 mt-1">Slot: {carta.slot}</p>
                    <p className="text-xs font-medium uppercase mt-1 mb-3 text-yellow-400">Rarità: {carta.rarity}</p>
                    {isFoil && <p className="text-red-400 font-bold text-base mb-2">⭐ FOIL ⭐</p>} */}
                    <img
                        src={carta.immagineUrl}
                        alt={carta.nome}
                        className="rounded-lg border-2 border-gray-700 max-w-full h-auto object-cover"
                        style={{ width: "100%", aspectRatio: "1/1.4" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x210/606060/FFFFFF?text=Card"; }}
                    />
                </div>
            </div>
        </div>
    );
};
// --- Fine CardFlip Component ---


function PacksDettail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    // Inizializza data come oggetto, assumendo che l'API restituisca un oggetto con contents
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPack = () => {
        setLoading(true);
        // Resetta i dati quando inizia un nuovo fetch
        setData({});
        axios.get(`http://localhost:3000/set/open/${slug}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching pack details:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        // La dipendenza [slug] garantisce che venga chiamato solo quando la route cambia
        fetchPack();
    }, [slug]);

    const handleOpenAnother = () => {
        // Richiama fetchPack per aprire un altro pacchetto
        fetchPack();
    };

    const handleGoBack = () => {
        navigate('/packs');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">

            {/* Stili CSS inseriti in un blocco <style> standard */}
            <style>
                {`
                /* Animazione per l'ingresso delle carte coperte */
                @keyframes fadeInScale {
                    0% { opacity: 0; transform: scale(0.9); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                /* KEYFRAMES per l'effetto FOIL */
                @keyframes shimmer {
                    0% {
                        background-position: 0% 0%;
                    }
                    100% {
                        background-position: 100% 100%;
                    }
                }
                /* Fine KEYFRAMES */


                .card-container {
                    /* Imposta dimensioni e prospettiva per l'effetto 3D */
                    width: 100%;
                    height: 350px; 
                    perspective: 1000px;
                    cursor: pointer;
                    margin-left: auto;
                    margin-right: auto;
                    animation: fadeInScale 0.4s ease forwards; 
                    opacity: 0;
                    max-width: 250px;
                }

                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1); /* Transizione di rotazione */
                    transform-style: preserve-3d;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.5);
                }

                .card-inner.flipped {
                    transform: rotateY(180deg);
                }

                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden; /* Nasconde la faccia posteriore quando ruota */
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                /* Stile FOIL aggiunti */
                .foil-card .card-face.card-front {
                    position: relative;
                    /* Nascondiamo l'overflow per l'animazione */
                    overflow: hidden; 
                    background: #1f2937;
                }

                .foil-card .card-face.card-front::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    /* Gradiente animato per simulare i brillantini */
                    background: linear-gradient(
                        -45deg, 
                        rgba(255, 255, 255, 0) 0%, 
                        rgba(255, 255, 255, 0.2) 35%, 
                        rgba(255, 255, 255, 0.4) 45%, 
                        rgba(255, 255, 255, 0.5) 50%, 
                        rgba(255, 255, 255, 0.4) 55%, 
                        rgba(255, 255, 255, 0.2) 65%, 
                        rgba(255, 255, 255, 0) 100%
                    );
                    background-size: 200% 200%;
                    /* Applica un pattern tipo 'stelle' al foil */
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' seed='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.5'/%3E%3C/svg%3E");
                    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' seed='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.5'/%3E%3C/svg%3E");
                    
                    /* Forza il blending del gradiente sull'immagine sottostante (se presente) */
                    mix-blend-mode: screen; 
                    animation: shimmer 5s linear infinite;
                    pointer-events: none; /* Assicura che il layer foil non interferisca con i click */
                }
                
                /* Fine Stile FOIL aggiunti */


                .card-back {
                    /* Stile per il dorso della carta */
                    border: 5px solid #e94560; /* Bordo rosso (stile MTG pack) */
                    justify-content: center;
                    align-items: center;
                    padding: 0;
                    background-color: #1f2937;
                }

                .card-back-image {
                    width: 80%;
                    height: 80%;
                    object-fit: contain;
                    display: block;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                }

                .card-front {
                    transform: rotateY(180deg); /* La parte frontale parte girata */
                    padding: 1rem;
                    justify-content: flex-start;
                    background: #1f2937;
                }
                
                /* Hover effect on the container to slightly lift the card */
                .card-container:hover .card-inner {
                     transform: scale(1.03);
                     box-shadow: 0 15px 20px rgba(0,0,0,0.7);
                }

                /* Stili per Rarità e Foil, applicati al contenitore interno per il bordo */
                .foil-card {
                    border: 3px solid #FFD700; 
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
                }
                
                .rarity-common { border-left: 5px solid #A9A9A9; }
                .rarity-uncommon { border-left: 5px solid #3498db; }
                .rarity-rare { border-left: 5px solid #e74c3c; }
                .rarity-mythic { border-left: 5px solid #f1c40f; }

                /* Stili Spinner */
                .mtg-spinner-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
                }
                .mtg-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #333;
                    border-radius: 50%;
                    border-top-color: #e94560;
                    animation: spin 1s linear infinite;
                    position: relative;
                }
                .mana-symbol {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                    color: #e94560;
                }
                .loading-text {
                    margin-top: 15px;
                    font-size: 1.2rem;
                    color: #e94560;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>


            {/* Utilizzo di Tailwind per header/bottoni per mantenere lo stile pulito */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-4 sm:mb-0">Pacchetto aperto: {data.set_code || slug?.toUpperCase()}</h1>
                <div className="flex space-x-3 action-buttons">
                    <button
                        className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
                        onClick={handleGoBack}
                    >
                        <span className="mr-2">←</span> Scegli altro pacchetto
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 flex items-center"
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
                // La griglia ora mappa le carte nel componente CardFlip
                <div className="grid cards-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {data.contents && data.contents.map((carta, index) => (
                        <CardFlip key={index} carta={carta} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PacksDettail;