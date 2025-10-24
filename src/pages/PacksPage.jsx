import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function PacksPage() {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Carica impostazioni salvate da sessionStorage
    const [searchTerm, setSearchTerm] = useState(() => {
        return sessionStorage.getItem('mtg_searchTerm') || "";
    });
    const [sortBy, setSortBy] = useState(() => {
        return sessionStorage.getItem('mtg_sortBy') || "released_at_desc";
    });

    const EXCLUDED_SET_CODES = ['om1'];

    function fetchPacks() {
        axios
            .get("http://localhost:3000/set")
            .then((response) => {
                const responseData = response.data;
                const setsArray = responseData.sets;
                const today = new Date().toISOString().split("T")[0];

                const ACCEPTED_SET_TYPES = ['expansion', 'core'];

                const filteredSets = setsArray.filter((pack) => {
                    const isAcceptedType = ACCEPTED_SET_TYPES.includes(pack.set_type);
                    const isReleased = pack.released_at <= today;
                    const isExcluded = EXCLUDED_SET_CODES.includes(pack.code);

                    return isAcceptedType && isReleased && !isExcluded;
                });

                setPacks({ ...responseData, sets: filteredSets });
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
    }

    function handleSortChange(e) {
        const value = e.target.value;
        setSortBy(value);
        sessionStorage.setItem('mtg_sortBy', value);
    }

    useEffect(() => {
        fetchPacks();
    }, []);

    const packsToDisplay = packs.sets
        ? packs.sets
            .filter((pack) =>
                pack.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
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
            })
        : [];

    return (
        <>
            <div className="page-header">
                <Link to="/" className="btn btn-outline-light back-button">
                    <span>← Torna alla Home</span>
                </Link>
                <h1>Scegli il tuo pacchetto</h1>
            </div>

            <div className="controls-container d-flex justify-content-center gap-3" style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Cerca per nome del pacchetto..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ padding: "10px", width: "300px" }}
                />
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{ padding: "10px" }}
                >
                    <option value="name_asc">Nome (A-Z) ⬆️</option>
                    <option value="name_desc">Nome (Z-A) ⬇️</option>
                    <option value="released_at_desc">Data Uscita (Recenti) ⬇️</option>
                    <option value="released_at_asc">Data Uscita (Meno Recenti) ⬆️</option>
                </select>
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
                    {packsToDisplay.map((pack) => (
                        <div key={pack.id} className="card pack-card" style={{ marginBottom: "1rem" }}>
                            <h2>{pack.name}</h2>
                            <p>Code: {pack.code}</p>
                            <img
                                src={pack.icon_svg_uri}
                                alt={pack.name}
                                style={{ maxWidth: "3rem" }}
                            />
                            <p>Release Date: {pack.released_at}</p>
                            <Link className="btn btn-success" to={`/packs/${pack.code}`}>
                                🎲 Apri pacchetto
                            </Link>
                        </div>
                    ))}
                    {packsToDisplay.length === 0 && (
                        <div className="text-center text-white mt-5">
                            <p style={{ fontSize: "1.2rem" }}>Nessun pacchetto trovato con i criteri attuali.</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default PacksPage;