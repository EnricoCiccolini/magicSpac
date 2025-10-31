import { Link } from "react-router-dom";

function PackCard({ pack }) {
  return (
    <div className="card pack-card">
      <h2>{pack.name}</h2>
      <p>Code: {pack.code}</p>
      <img
        src={pack.icon_svg_uri}
        alt={pack.name}
        className="pack-icon"
      />
      <p>Release Date: {pack.released_at}</p>
      <Link className="btn btn-success" to={`/packs/${pack.code}`}>
        🎲 Apri pacchetto
      </Link>
    </div>
  );
}

export default PackCard;