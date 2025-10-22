import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function PacksPage() {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("released_at_desc");

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
        setSearchTerm(e.target.value);
    }

    function handleSortChange(e) {
        setSortBy(e.target.value);
    }

    useEffect(() => {
        fetchPacks();
    }, []);

    console.log(packs);


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
            <h1>Pagina dei pacchetti</h1>
            <div className="controls-container d-flex justify-content-center" style={{ marginBottom: "1rem" }}>
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
                <p>Loading...</p>
            ) : (
                packsToDisplay.map((pack) => (
                    <div key={pack.id} className="card" style={{ marginBottom: "1rem" }}>
                        <h2>{pack.name}</h2>
                        <p>Code: {pack.code}</p>
                        <img
                            src={pack.icon_svg_uri}
                            alt={pack.name}
                            style={{ maxWidth: "3rem" }}
                        />
                        <p>Release Date: {pack.released_at}</p>
                        <Link className="btn btn-success" to={`/packs/${pack.code}`}>
                            vai ad aprire
                        </Link>
                    </div>
                ))
            )}
            {packsToDisplay.length === 0 && !loading && (
                <p>Nessun pacchetto trovato con i criteri attuali.</p>
            )}
        </>
    );
}

export default PacksPage;