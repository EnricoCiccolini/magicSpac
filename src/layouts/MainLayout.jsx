
import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Snowfall from "react-snowfall"

function MainLayout() {

    return <>
        <Snowfall color="white" />

        <Header />
        <main className="container flex-grow-1">
            <Outlet />
        </main>

    </>
}

export default MainLayout