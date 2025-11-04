// PacksDettailPage.jsx

import { useState, useContext, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Importa useNavigate
import useOpen from "../hook/useOpen";
import GlobalContext from "../context/GlobalContext";

// CardFlip aggiornato per layout
const CardFlip = ({ carta, index, onFlip, isFlippedState }) => {
  const { setDetail } = useContext(GlobalContext);
  const navigate = useNavigate(); // Usa useNavigate all'interno del componente
  const isFoil = carta.foil === true;

  const handleInteraction = () => {
    // 1. Se NON è flippata, la flippa.
    if (!isFlippedState) {
      onFlip(index, true);
    } else {
      // 2. Se è flippata, simula l'azione del pulsante Dettagli
      setDetail(carta);
      // Naviga al percorso del dettaglio (il percorso è relativo alla route corrente, come nel Link)
      navigate(`./${encodeURIComponent(carta.nome)}`);
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
      // Modificato: Ora chiama handleInteraction
      onClick={handleInteraction}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-scale-wrapper">
        <div className={`card-inner ${isFlippedState ? "flipped" : ""}`}>
          <div className="card-face card-back">
            {/* FIX: Aggiunto un wrapper d-flex con h-100 per mantenere l'altezza uniforme e centrare l'immagine sul retro. */}
            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
              <img
                src={backImageUrl}
                alt="Card Back"
                className="card-back-image"
              />
            </div>
          </div>
          <div className="card-face card-front">
            {/* RIMOSSO p-2: il padding è ora gestito dal CSS globale per garantire l'uniformità dell'altezza */}
            <div className="d-flex flex-column h-100 justify-content-between">
              {/* Contenitore Immagine & Badge: gestito da flex-grow-1 */}
              <div className="card-image-wrapper flex-grow-1 d-flex align-items-center justify-content-center">
                {isFoil && (
                  <span className="badge foil-badge text-uppercase foil-absolute-position">
                    Foil
                  </span>
                )}
                <img
                  src={imageUrl}
                  alt={carta.nome}
                  className="img-fluid card-art-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/200x280/606060/FFFFFF?text=No+Image";
                  }}
                />
              </div>

              {/* Blocco Dettagli: ORA CON ALTEZZA FISSA nel CSS */}
              <div className="card-details-footer">
                <p
                  className="small text-white mb-1"
                  style={{
                    /* Rimosso style inline per overflow/whiteSpace - gestito in index.css */
                    fontWeight: "bold",
                  }}
                >
                  {/* Assicurati che il nome della carta appaia qui se necessario, altrimenti lascialo vuoto */}
                  {carta.nome}
                </p>
                <p className="small text-muted mb-1">
                  Prezzo: {carta.price || "N/A"}
                </p>
                {/* PULSANTE RIMOSSO: La logica è stata spostata nell'onClick del contenitore */}
                {/* <Link
                  to={`./${encodeURIComponent(carta.nome)}`}
                  onClick={() => setDetail(carta)}
                  className="btn btn-sm btn-outline-info w-100 mt-2"
                  style={{ zIndex: 12 }}
                >
                  Dettagli
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Modale di Conferma (NESSUNA MODIFICA)
const ConfirmModal = ({ show, onConfirm, onCancel, setCode }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎲 Apri Nuovo Pacchetto?</h3>
        </div>
        <div className="modal-body">
          <p>
            Sei sicuro di voler aprire un nuovo pacchetto{" "}
            <strong>{setCode?.toUpperCase()}</strong>?
          </p>
          <p className="text-muted small">
            Le carte del pacchetto attuale non verranno salvate.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Annulla
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principale PacksDettail (NESSUNA MODIFICA)
function PacksDettail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { openedPackData, setOpenedPackData, setDetail } =
    useContext(GlobalContext);

  const initialDataFound = openedPackData && openedPackData.slug === slug;

  // STATO per forzare il refetch
  const [forceRefetch, setForceRefetch] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const {
    data: hookData,
    loading,
    error,
    openPack: fetchNewPack,
  } = useOpen(slug, { skipFetch: initialDataFound, forceRefetch });

  // Funzione per aggiornare lo stato di flip nel contesto globale
  const updateCardFlipStatus = useCallback(
    (cardIndex, newFlippedState) => {
      if (!openedPackData || openedPackData.slug !== slug) return;

      setOpenedPackData((prevData) => {
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
            contents: newContents,
          },
        };
      });
    },
    [openedPackData, setOpenedPackData, slug]
  );

  // SINCRONIZZAZIONE: salva i nuovi dati nel contesto globale
  useEffect(() => {
    // 1. Controlliamo che ci siano dati validi dal hook
    if (hookData && hookData.contents && hookData.contents.length > 0) {
      // Aggiungi isFlipped: false a tutte le carte
      const contentsWithState = hookData.contents.map((card) => ({
        ...card,
        isFlipped: false,
      }));

      const newData = { ...hookData, contents: contentsWithState };

      // Salva sempre i nuovi dati quando arrivano dall'hook
      setOpenedPackData({ slug: slug, data: newData });
    }
  }, [hookData, slug, setOpenedPackData]);

  // Funzione che apre il modale
  const handleOpenAnotherClick = () => {
    setShowModal(true);
  };

  // Funzione chiamata quando l'utente conferma nel modale
  const handleConfirmOpenAnother = () => {
    setShowModal(false);

    // Resetta i dati persistenti per mostrare il loading
    setOpenedPackData(null);

    // Incrementa forceRefetch per triggerare il nuovo fetch nell'hook
    setForceRefetch((prev) => prev + 1);
  };

  // Funzione chiamata quando l'utente annulla
  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleGoBack = () => {
    setOpenedPackData(null);
    navigate("/packs");
  };

  // Determina quali dati mostrare
  const displayData =
    openedPackData && openedPackData.slug === slug ? openedPackData.data : {};
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
            onClick={handleOpenAnotherClick}
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
              key={`${carta.multiverse_ids?.[0] || carta.id || index
                }-${forceRefetch}`}
              carta={carta}
              index={index}
              isFlippedState={carta.isFlipped}
              onFlip={updateCardFlipStatus}
            />
          ))}
        </div>
      )}

      {error && !loading && CardList.length === 0 && (
        <div className="alert alert-danger mt-4">
          Errore nel caricamento del pacchetto: {error.message}
        </div>
      )}

      {/* Modale di Conferma */}
      <ConfirmModal
        show={showModal}
        onConfirm={handleConfirmOpenAnother}
        onCancel={handleCancelModal}
        setCode={displayData.set_code || slug}
      />
    </div>
  );
}

export default PacksDettail;