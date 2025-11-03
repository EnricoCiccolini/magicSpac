import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useMemo } from "react";
import GlobalContext from "./context/GlobalContext";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/Homepage";
import PacksPage from "./pages/PacksPage";
import PacksDettail from "./pages/PacksDettailPage";
import DettailCard from "./pages/DettailCard";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [detail, setDetail] = useState({});
  const [openedPackData, setOpenedPackData] = useState(null);

  const contextValue = useMemo(() => ({ 
      detail, 
      setDetail, 
      openedPackData, 
      setOpenedPackData // Aggiunto
  }), [detail, openedPackData]);

  return (
    <GlobalContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/packs/:slug" element={<PacksDettail />} />
            <Route path="/packs/:slug/:name" element={<DettailCard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
}

export default App;