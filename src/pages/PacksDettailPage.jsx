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
            {/* AGGIUNTO: Wrapper per gestire l'effetto scale su hover */}
            <div className="card-scale-wrapper">
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

            {/* Il blocco <style> è stato rimosso e gli stili sono in index.css */}


            {/* Utilizzo di Tailwind per header/bottoni per mantenere lo stile pulito */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-4 sm:mb-0">Pacchetto aperto: {data.set_code || slug?.toUpperCase()}</h1>
                <div className="flex space-x-3 action-buttons">
                    {/* AGGIORNATO: Classe personalizzata per il bottone 'Indietro' */}
                    <button
                        className="btn-action btn-go-back"
                        onClick={handleGoBack}
                    >
                        <span className="mr-2">←</span> Scegli altro pacchetto
                    </button>
                    {/* AGGIORNATO: Classe personalizzata per il bottone 'Apri' */}
                    <button
                        className="btn-action btn-open-pack"
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
                // AGGIORNATO: Rimosse le classi di colonna Tailwind per usare interamente il CSS in index.css
                <div className="grid cards-grid gap-6"> 
                    {data.contents && data.contents.map((carta, index) => (
                        <CardFlip key={index} carta={carta} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PacksDettail;