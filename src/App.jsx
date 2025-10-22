import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/Homepage"
import PacksPage from "./pages/PacksPage"
import PacksDettail from "./pages/PacksDettailPage"
import NotFoundPage from "./pages/NotFoundPage"
import MainLayout from "./layouts/MainLayout"


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/packs/:slug" element={<PacksDettail />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
