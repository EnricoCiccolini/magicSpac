import { NavLink } from "react-router-dom"

function Header() {


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <NavLink className="navbar-brand" to="/"><img src="navbar-logo.png" alt="navbar-logo" style={{ maxWidth: "3rem" }} /></NavLink>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="navbar-brand" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="navbar-brand" to="/packs">Menu</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

            </header>
        </>
    )
}

export default Header