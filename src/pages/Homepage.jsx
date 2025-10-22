import { Link } from "react-router-dom"



function HomePage() {


    return (
        <>
            <div className="container text-center text-white d-flex flex-column align-items-center justify-content-center m-3" >
                <h1 className="home-title">benvenuti nel nostro motore di simulazione di spacchettamenti per mtg</h1>
                <p>clicca sul pulsante per scegliere il pacchetto </p>
                <img src="navbar-logo.png" alt="navbar-logo" style={{ maxWidth: "30rem" }} />
                <Link className="btn btn-outline-light home-btn" to="/packs">menu</Link>




            </div>
        </>
    )
}

export default HomePage