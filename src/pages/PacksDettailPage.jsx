import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



function PacksDettail() {
    const { slug } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:3000/set/open/${slug}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching pack details:", error);
                setLoading(false);
            });
    }, [slug]);

    console.log(data);
    return (
        <>
            <h1>Pacchetto aperto: {data.set_code}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (

                data.contents && data.contents.map((carta, index) => (
                    <div key={index} className="card" style={{ border: '1px solid gray', margin: '1rem', padding: '1rem' }}>
                        <h3>{carta.nome}</h3>
                        <p>Slot: {carta.slot}</p>
                        <p>Rarità: {carta.rarity}</p>
                        <img src={carta.immagineUrl} alt={carta.nome} style={{ maxWidth: "15rem" }} />
                    </div>
                ))
            )}
        </>
    )

}

export default PacksDettail