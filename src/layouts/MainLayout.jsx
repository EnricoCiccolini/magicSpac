
import { Outlet } from "react-router-dom"
import Header from "../components/Header"


function MainLayout() {

    return <>


        <Header />
        <main className="container flex-grow-1">
            <Outlet />
        </main>

    </>
}

export default MainLayout