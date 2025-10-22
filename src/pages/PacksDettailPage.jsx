import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



function PlateDettail() {
    const { slug } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    return (
        <>
            <h1>Pacchetto con slug {slug}</h1>
        </>
    )
}

export default PlateDettail