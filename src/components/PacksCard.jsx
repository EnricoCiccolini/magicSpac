import { Link } from "react-router-dom";

function PackCard({ pack }) {
  // Fallback multipli per assicurare che il nome sia sempre presente
  const packName = pack.name || pack.set_name || pack.code?.toUpperCase() || "Espansione Sconosciuta";
  
  return (
    <div className="card pack-card">
      <h2 className="pack-card-title">{packName}</h2>
      <p className="pack-code">Code: {pack.code}</p>
      <div className="pack-icon-container">
        <img
          src={pack.icon_svg_uri}
          alt={packName}
          className="pack-icon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/128x128/0f3460/e94560?text=" + encodeURIComponent(pack.code || "?");
          }}
        />
      </div>
      <p className="pack-release-date">Release Date: {pack.released_at || "N/A"}</p>
      <Link className="btn btn-success" to={`/packs/${pack.code}`}>
        🎲 Apri pacchetto
      </Link>
    </div>
  );
}

export default PackCard;