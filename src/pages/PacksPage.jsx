import axios from "axios";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";

function PacksPage() {

    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);


    function fetchPacks() {
        axios.get("http://localhost:3003/set")
            .then((response) => {
                setPacks(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching packs:", error);
                setLoading(false);
            });
    }
    console.log(packs);

    useEffect(() => {
        fetchPacks();
    }, []);
    return (
        <>

            <h1>Pagina dei pacchetti</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (packs.sets.map((pack) => (
                <div key={pack.id} className="card">
                    <h2>{pack.name}</h2>
                    <p>Code: {pack.code}</p>
                    <img src={pack.icon_svg_uri} alt={pack.name} style={{ maxWidth: "3rem" }} />
                    <p>Release Date: {pack.released_at}</p>
                    <Link className="btn btn-success" to={`/packs/${pack.code}`}>vai ad aprire</Link>
                </div>
            ))
            )}

        </>
    )
}

export default PacksPage