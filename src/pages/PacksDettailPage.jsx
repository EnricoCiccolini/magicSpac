import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PacksDettail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPack = () => {
        setLoading(true);
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
        fetchPack();
    }, [slug]);

    const handleOpenAnother = () => {
        fetchPack();
    };

    const handleGoBack = () => {
        navigate('/packs');
    };

    return (
        <>
            <div className="pack-detail-header">
                <h1>Pacchetto aperto: {data.set_code}</h1>
                <div className="action-buttons">
                    <button className="btn btn-outline-light" onClick={handleGoBack}>
                        ← Scegli altro pacchetto
                    </button>
                    <button className="btn btn-success" onClick={handleOpenAnother}>
                        🎲 Apri un altro {data.set_code}
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
                        <div 
                            key={index} 
                            className={`card rarity-${carta.rarity?.toLowerCase()}`}
                            style={{ 
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            <h3>{carta.nome}</h3>
                            <p>Slot: {carta.slot}</p>
                            <p>Rarità: {carta.rarity}</p>
                            <img src={carta.immagineUrl} alt={carta.nome} style={{ maxWidth: "15rem" }} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default PacksDettail;