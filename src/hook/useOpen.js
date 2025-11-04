import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook per gestire la logica di apertura del pacchetto,
 * il fetching dei dati e lo stato di caricamento.
 *
 * @param {string} slug - Lo slug (codice set) per l'API call.
 * @param {object} options - Opzioni configurabili
 * @param {boolean} options.skipFetch - Se true, salta il fetch iniziale
 * @param {number} options.forceRefetch - Incrementa questo valore per forzare un nuovo fetch
 * @returns {{ data: object, loading: boolean, error: object, openPack: () => void }}
 */
const useOpen = (slug, options = {}) => {
    const { skipFetch = false, forceRefetch = 0 } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!skipFetch);
    const [error, setError] = useState(null);

    const fetchPack = useCallback(() => {
        if (!slug) return;

        setLoading(true);
        setError(null);
        setData(null); // Resetta i dati per l'apertura di un nuovo pacchetto

        axios.get(`http://localhost:3000/set/open/${slug}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching pack details:", err);
                setError(err);
                setLoading(false);
            });
    }, [slug]);

    // Effettua il fetch iniziale quando il componente si monta o lo slug cambia
    // MA solo se skipFetch è false
    useEffect(() => {
        if (!skipFetch) {
            fetchPack();
        } else {
            setLoading(false);
        }
    }, [slug, skipFetch, fetchPack]);

    // Effettua un nuovo fetch quando forceRefetch cambia (e non è 0)
    useEffect(() => {
        if (forceRefetch > 0) {
            fetchPack();
        }
    }, [forceRefetch, fetchPack]);

    return {
        data,
        loading,
        error,
        openPack: fetchPack
    };
};

export default useOpen;