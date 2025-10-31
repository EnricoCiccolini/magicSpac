import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook per gestire la logica di apertura del pacchetto,
 * il fetching dei dati e lo stato di caricamento.
 *
 * @param {string} slug - Lo slug (codice set) per l'API call.
 * @returns {{ data: object, loading: boolean, fetchPack: () => void }}
 */
const useOpen = (slug) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPack = useCallback(() => {
        if (!slug) return;

        setLoading(true);
        setData({}); // Resetta i dati per l'apertura di un nuovo pacchetto
        axios.get(`http://localhost:3000/set/open/${slug}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching pack details:", error);
                // Potresti voler mantenere il pacchetto precedente in caso di errore
                setLoading(false);
            });
    }, [slug]); // Ricalcola solo se lo slug cambia

    // Effettua il fetch iniziale quando il componente si monta o lo slug cambia
    useEffect(() => {
        fetchPack();
    }, [fetchPack]);

    return { data, loading, fetchPack };
};

export default useOpen;