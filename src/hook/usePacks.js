import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 9;

export function usePacks() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem("mtg_searchTerm") || "";
  });
  
  const [sortBy, setSortBy] = useState(() => {
    return sessionStorage.getItem("mtg_sortBy") || "released_at_desc";
  });

  useEffect(() => {
    fetchPacks();
  }, []);

  function fetchPacks() {
    setLoading(true);
    axios
      .get("http://localhost:3000/set")
      .then((response) => {
        const allSets = response.data.sets || response.data || [];
        setPacks(allSets);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching packs:", error);
        setLoading(false);
      });
  }

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    sessionStorage.setItem("mtg_searchTerm", value);
    setCurrentPage(1);
  }

  function handleSortChange(e) {
    const value = e.target.value;
    setSortBy(value);
    sessionStorage.setItem("mtg_sortBy", value);
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const { packsToDisplay, totalFilteredPages, totalFilteredPacks } = useMemo(() => {
    const packsArray = Array.isArray(packs) ? packs : packs.sets || [];

    // Filtro
    const filteredPacks = packsArray.filter((pack) =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordinamento
    const sortedPacks = filteredPacks.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name_asc") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "name_desc") {
        comparison = b.name.localeCompare(a.name);
      } else if (sortBy === "released_at_desc") {
        comparison = new Date(b.released_at) - new Date(a.released_at);
      } else if (sortBy === "released_at_asc") {
        comparison = new Date(a.released_at) - new Date(b.released_at);
      }

      return comparison;
    });

    // Paginazione
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const packsForCurrentPage = sortedPacks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPacks.length / ITEMS_PER_PAGE);

    return {
      packsToDisplay: packsForCurrentPage,
      totalFilteredPages: totalPages,
      totalFilteredPacks: filteredPacks.length,
    };
  }, [packs, searchTerm, sortBy, currentPage]);

  const getPageNumbers = () => {
    const totalPages = totalFilteredPages;
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfMax = Math.floor(maxPagesToShow / 2);

      if (currentPage <= halfMax) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + halfMax >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfMax;
        endPage = currentPage + halfMax;
      }
    }

    if (startPage < 1) startPage = 1;

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return {
      pages,
      showStartEllipsis: startPage > 1,
      showEndEllipsis: endPage < totalPages,
    };
  };

  return {
    loading,
    searchTerm,
    sortBy,
    currentPage,
    packsToDisplay,
    totalFilteredPages,
    totalFilteredPacks,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    getPageNumbers,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}