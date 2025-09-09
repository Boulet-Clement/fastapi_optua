'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";

// Types
interface Tag {
  code: string;
  name: string;
}

interface CategoryTag {
  code: string;
  category_name: string;
  tags: Tag[];
}

interface SearchResult {
  _id: string;
  name: string;
  chapo: string;
  url: string;
  image?: string;
}

const API_BASE = "http://localhost:8000";

export default function SearchEnginePage() {
  const [categorizedTags, setCategorizedTags] = useState<CategoryTag[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // --- Fetch categories & tags ---
  const fetchCategorizedTags = async () => {
    try {
      const response = await axios.get<CategoryTag[]>(`${API_BASE}/filters?lang=fr`);
      setCategorizedTags(response.data);
    } catch (error) {
      console.error("Erreur API:", error);
      setCategorizedTags([]);
    }
  };

  // --- Submit search via GET ---
  const submitSearch = async (searchText?: string, filters?: string[], updateURL = true) => {
    try {
      const params = new URLSearchParams();
      const q = searchText !== undefined ? searchText : search;
      const f = filters !== undefined ? filters : activeFilters;

      if (q) params.append("query", q);
      if (f.length) params.append("tags", f.join(","));
      params.append("lang", "fr");

      if (updateURL) {
        // Met à jour l'URL sans recharger la page
        window.history.replaceState({}, "", `?${params.toString()}`);
      }

      const response = await axios.get<SearchResult[]>(`${API_BASE}/search?${params.toString()}`);
      setResults(response.data);
    } catch (error) {
      console.error("Erreur recherche:", error);
      setResults([]);
    }
  };

  // --- On mount ---
  useEffect(() => {
    fetchCategorizedTags();

    // Lire paramètres depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("query") || "";
    const tagsParam = params.get("tags")?.split(",") || [];

    setSearch(queryParam);
    setActiveFilters(tagsParam);

    // Fetch initial avec les paramètres de l'URL
    submitSearch(queryParam, tagsParam, false);
  }, []);

  // --- Toggle filter ---
  const toggleFilter = (tagCode: string) => {
    const newFilters = activeFilters.includes(tagCode)
      ? activeFilters.filter((t) => t !== tagCode)
      : [...activeFilters, tagCode];
    setActiveFilters(newFilters);
    submitSearch(undefined, newFilters); // met à jour les résultats et l'URL
  };

  // --- Clear all filters ---
  const clearAllFilters = () => {
    setActiveFilters([]);
    submitSearch(undefined, []);
  };

  return (
    <div className="w-full min-h-screen p-6 flex gap-6">
      {/* Sidebar */}
      <aside className="w-1/4 space-y-6">
        {categorizedTags.map((category) => (
          <div key={category.code} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">{category.category_name}</h2>
            <div className="space-y-1">
              {category.tags.map((tag) => (
                <label key={tag.code} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={activeFilters.includes(tag.code)}
                    onChange={() => toggleFilter(tag.code)}
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => submitSearch(search, activeFilters)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rechercher
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filterCode) => {
              let label = "";
              for (const category of categorizedTags) {
                const tag = category.tags.find((t) => t.code === filterCode);
                if (tag) {
                  label = tag.name;
                  break;
                }
              }
              return (
                <div key={filterCode} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
                  <span>{label}</span>
                  <button
                    className="ml-2 font-bold"
                    onClick={() =>
                      toggleFilter(filterCode) // utilise toggleFilter pour mise à jour
                    }
                  >
                    &times;
                  </button>
                </div>
              );
            })}
            <button
              className="ml-2 text-red-500 hover:underline"
              onClick={clearAllFilters}
            >
              Tout supprimer
            </button>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.length === 0 && <p>Aucun résultat pour le moment...</p>}
          {results.map((result) => (
            <a key={result._id} href={result.url} target="_blank" className="block">
              <div className="flex items-start bg-white p-4 rounded-lg shadow">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {result.image ? (
                    <img src={result.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center text-sm text-blue-500 h-full">
                      Aucune image
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-lg">{result.name}</h3>
                  <p className="text-gray-700">{result.chapo}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
