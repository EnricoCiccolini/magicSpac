// PacksDettailPage.jsx

import { useState, useContext, useEffect, useCallback } from "react"; 
import { useParams, useNavigate, Link } from "react-router-dom";
import useOpen from "../hook/useOpen";
import GlobalContext from "../context/GlobalContext";

// CardFlip aggiornato per layout
const CardFlip = ({ carta, index, onFlip, isFlippedState }) => {
  const { setDetail } = useContext(GlobalContext); 
  const isFoil = carta.foil === true;

  const handleFlip = () => {
    if (!isFlippedState) { 
      onFlip(index, true); 
    }
  };
  
  const cardRarityClass = `rarity-${carta.rarity?.toLowerCase()}`;
  const foilContainerClass = isFoil ? "foil-card" : "";
  const backImageUrl = "https://i.imgur.com/LdOBU1I.jpeg";
  const imageUrl = Array.isArray(carta.immagineUrl)
    ? carta.immagineUrl[0]
    : carta.immagineUrl;

  return (
    <div
      className={`card-container ${cardRarityClass} ${foilContainerClass}`}
      onClick={handleFlip} 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-scale-wrapper">
        <div className={`card-inner ${isFlippedState ? "flipped" : ""}`}> 
          <div className="card-face card-back">
            <img 
                src={backImageUrl} 
                alt="Card Back" 
                className="card-back-image" 
            />
          </div>
          <div className="card-face card-front">
            <div className="d-flex flex-column h-100 justify-content-between p-2">
                
                <div className="d-flex justify-content-end align-items-start w-100 mb-2">
                    {/* RIMOZIONE RARITÀ e mantenimento solo del badge Foil */}
                    {isFoil && <span className="badge foil-badge text-uppercase">Foil</span>}
                </div>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <img 
                        src={imageUrl} 
                        alt={carta.nome} 
                        className="img-fluid" 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/200x280/606060/FFFFFF?text=No+Image";
                        }}
                    />
                </div>

                <div className="mt-2 w-100">
                    {/* RIDUZIONE DELLA DIMENSIONE DEL NOME: da h6 a small */}
                    <p className="small text-white mb-1" style={{ 
                        // Stili per troncare il testo se troppo lungo
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold' 
                    }}>
                        {carta.nome}
                    </p>
                    <p className="small text-muted mb-1">Prezzo: {carta.price || "N/A"}</p>
                    <Link 
                        to={`./${encodeURIComponent(carta.nome)}`}
                        onClick={() => setDetail(carta)}
                        className="btn btn-sm btn-outline-info w-100 mt-2"
                        style={{ zIndex: 12 }}
                    >
                        Dettagli
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


function PacksDettail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { openedPackData, setOpenedPackData, setDetail } = useContext(GlobalContext);

  const initialDataFound = openedPackData && openedPackData.slug === slug;
  
  // STATO AGGIUNTIVO: Forza un refetch quando clicchiamo "Apri un altro"
  const [forceRefetch, setForceRefetch] = useState(0); 

  const { 
      data: hookData, 
      loading, 
      error, 
      openPack: fetchNewPack 
    } = useOpen(slug, { skipFetch: initialDataFound, forceRefetch }); // PASSAGGIO DEL NUOVO STATO

  // Funzione per aggiornare lo stato di flip nel contesto globale (Invariata)
  const updateCardFlipStatus = useCallback((cardIndex, newFlippedState) => {
    if (!openedPackData || openedPackData.slug !== slug) return;

    setOpenedPackData(prevData => {
        if (!prevData || prevData.slug !== slug) return prevData;

        const newContents = prevData.data.contents.map((card, idx) => {
            if (idx === cardIndex) {
                return { ...card, isFlipped: newFlippedState }; 
            }
            return card;
        });
        
        return {
            ...prevData,
            data: {
                ...prevData.data,
                contents: newContents
            }
        };
    });
  }, [openedPackData, setOpenedPackData, slug]);


  // SINCRONIZZAZIONE (MODIFICATA per non bloccare il fetch forzato)
  useEffect(() => {
    // 1. Controlliamo che ci siano dati validi dal hook
    if (hookData && hookData.contents && hookData.contents.length > 0) {
      
      // 2. Logica per *non* sovrascrivere dati persistenti a meno che non stiamo forzando
      const isPersistentDataValid = openedPackData && openedPackData.slug === slug;
      
      // Se ci sono dati persistenti validi E NON stiamo forzando un fetch, non facciamo nulla (usciamo).
      if (isPersistentDataValid && forceRefetch === 0) {
          return; 
      }
      
      // Se arriviamo qui, i dati vanno salvati: o non c'erano dati persistenti, o stavamo forzando.
      const contentsWithState = hookData.contents.map(card => ({
        ...card,
        isFlipped: false 
      }));
      
      const newData = { ...hookData, contents: contentsWithState };
      
      setOpenedPackData({ slug: slug, data: newData });
      
      // Dopo aver salvato il nuovo pacchetto, resettiamo forceRefetch
      if (forceRefetch > 0) {
        setForceRefetch(0); 
      }
    }
  }, [hookData, slug, setOpenedPackData, openedPackData, forceRefetch]);

  
  const handleOpenAnother = () => {
    // 1. Forza l'aggiornamento dello stato per innescare un nuovo fetch.
    setForceRefetch(prev => prev + 1); 
    
    // 2. Resetta i dati persistenti per pulire il contesto e forzare la visualizzazione del loading.
    setOpenedPackData(null); 
    
    // 3. Chiama la funzione di fetch per aprire un NUOVO pacchetto
    fetchNewPack(); 
  };

  const handleGoBack = () => {
    setOpenedPackData(null); 
    navigate("/packs");
  };

  // Se è disponibile un pacchetto persistente, usiamo quello, altrimenti usiamo i dati freschi (hookData).
  const displayData = initialDataFound ? openedPackData.data : hookData || {};
  const CardList = displayData.contents || [];

  return (
    <div className="container min-vh-100 text-white p-4 p-sm-5">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 bg-secondary p-3 rounded shadow">
        <h1 className="h4 mb-3 mb-sm-0">
          Pacchetto aperto: {displayData.set_code || slug?.toUpperCase()}
        </h1>
        <div className="d-flex action-buttons">
          <button
            className="btn btn-action btn-go-back me-2"
            onClick={handleGoBack}
          >
            <span className="me-2">←</span> Scegli altro pacchetto
          </button>
          <button
            className="btn btn-action btn-open-pack"
            onClick={handleOpenAnother}
            disabled={loading} 
          >
            🎲 Apri un altro {displayData.set_code || slug?.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Mostra il loading se i dati non sono disponibili e la richiesta è in corso */}
      {loading && CardList.length === 0 ? ( 
        <div className="mtg-spinner-container">
          <div className="mtg-spinner">
            <div className="mana-symbol">✦</div>
          </div>
          <p className="loading-text">Aprendo il pacchetto...</p>
        </div>
      ) : (
        <div className="cards-grid">
          {CardList.map((carta, index) => (
            <CardFlip 
              key={carta.multiverse_ids?.[0] || index} 
              carta={carta} 
              index={index} 
              isFlippedState={carta.isFlipped} 
              onFlip={updateCardFlipStatus} 
            />
          ))}
        </div>
      )}
      
      {error && !loading && CardList.length === 0 && <div className="alert alert-danger mt-4">Errore nel caricamento del pacchetto: {error.message}</div>}
    </div>
  );
}

export default PacksDettail;