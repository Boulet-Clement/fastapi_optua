'use client';

import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import OrganizationCard from "@/components/search/OrganizationCard";
import Organization from "@/models/Organization";

interface Keyword {
  code: string;
  name: string;
}

interface CategoryKeyword {
  code: string;
  category_name: string;
  keywords: Keyword[];
}

interface SearchResult {
  _id: string;
  name: string;
  chapo: string;
  url: string;
  keywords?: string[];
}

const API_BASE = "http://localhost:8000";

type SearchParams = {
  lang: string;
  all_keywords_required: boolean;
  query?: string;
  keywords?: string[];
};

export default function SearchEnginePage() {
  const locale = useLocale();
  const trans = useTranslations("Search");

  const [categorizedKeywords, setCategorizedKeywords] = useState<CategoryKeyword[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Organization[]>([]);
  const [allKeywordsRequired, setAllKeywordsRequired] = useState<boolean>(false);

  const fetchCategorizedKeywords = useCallback(async () => {
    try {
      const response: AxiosResponse<CategoryKeyword[]> = await axios.get(
        `${API_BASE}/filters`,
        { params: { lang: locale } }
      );
      setCategorizedKeywords(response.data);
    } catch (error) {
      console.error("Erreur API:", error);
      setCategorizedKeywords([]);
    }
  }, [locale]);

  const submitSearch = useCallback(
    async (
      searchText?: string,
      filters?: string[],
      updateURL = true,
      allRequired?: boolean
    ) => {
      try {
        const q = searchText ?? search;
        const f = filters ?? activeFilters;
        const allRequiredValue = allRequired ?? allKeywordsRequired;

        const params: SearchParams = {
          lang: locale,
          all_keywords_required: allRequiredValue,
        };
        if (q) params.query = q;
        if (f.length) params.keywords = f;

        if (updateURL) {
          const urlParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) value.forEach(v => urlParams.append(key, v));
            else if (value !== undefined) urlParams.append(key, String(value));
          });
          window.history.replaceState({}, "", `?${urlParams.toString()}`);
        }

        const response: AxiosResponse<Organization[]> = await axios.get(
          `${API_BASE}/search`,
          {
            params,
            paramsSerializer: (params: Record<string, unknown>) => {
              const searchParams = new URLSearchParams();
              Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) value.forEach(v => searchParams.append(key, String(v)));
                else if (value !== undefined) searchParams.append(key, String(value));
              });
              return searchParams.toString();
            },
          }
        );

        setResults(response.data);
      } catch (error) {
        console.error("Erreur recherche:", error);
        setResults([]);
      }
    },
    [search, activeFilters, allKeywordsRequired, locale]
  );

  useEffect(() => {
    fetchCategorizedKeywords();

    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("query") || "";
    const keywordsParam = params.getAll("keywords");
    const allRequiredParam = params.get("all_keywords_required") === "true";

    setSearch(queryParam);
    setActiveFilters(keywordsParam);
    setAllKeywordsRequired(allRequiredParam);

    const fetchInitialResults = async () => {
      try {
        const response = await axios.get<Organization[]>(`${API_BASE}/search`, {
          params: {
            lang: locale,
            query: queryParam || undefined,
            keywords: keywordsParam.length ? keywordsParam : undefined,
            all_keywords_required: allRequiredParam,
          },
          paramsSerializer: (params: Record<string, unknown>) => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (Array.isArray(value)) value.forEach(v => searchParams.append(key, String(v)));
              else if (value !== undefined) searchParams.append(key, String(value));
            });
            return searchParams.toString();
          },
        });
        setResults(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Erreur recherche initiale:", error);
        setResults([]);
      }
    };

    fetchInitialResults();
  }, [locale, fetchCategorizedKeywords]);

  const toggleFilter = (keywordCode: string) => {
    const newFilters = activeFilters.includes(keywordCode)
      ? activeFilters.filter(t => t !== keywordCode)
      : [...activeFilters, keywordCode];
    setActiveFilters(newFilters);
    submitSearch(undefined, newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    submitSearch(undefined, []);
  };

  const clearSearch = () => {
    setSearch("");
    submitSearch("", activeFilters);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row gap-8 py-8">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 space-y-6">
        <div className="top-4 flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded shadow">
          <input
            type="checkbox"
            id="all-keywords-required"
            checked={allKeywordsRequired}
            onChange={e => {
              setAllKeywordsRequired(e.target.checked);
              submitSearch(undefined, undefined, true, e.target.checked);
            }}
            className="w-4 h-4 text-primary-light border-gray-300 rounded"
          />
          <label htmlFor="all-keywords-required" className="text-sm font-medium">
            {trans("toggleAllKeywordsRequired")}
          </label>
        </div>

        {categorizedKeywords.map(category => (
          <details key={category.code} className="bg-white rounded shadow" open>
            <summary className="cursor-pointer font-semibold px-4 py-2 border-b hover:bg-gray-50 transition">
              {category.category_name}
            </summary>
            <div className="p-4 space-y-2">
              {category.keywords.map(keyword => (
                <label
                  key={keyword.code}
                  className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={activeFilters.includes(keyword.code)}
                    onChange={() => toggleFilter(keyword.code)}
                  />
                  <span>{keyword.name}</span>
                </label>
              ))}
            </div>
          </details>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 space-y-6">
        <form
          onSubmit={e => {
            e.preventDefault();
            submitSearch(search, activeFilters);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={trans("searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light pr-10 placeholder-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            {trans("searchButton")}
          </button>
        </form>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filterCode => {
              let label = "";
              for (const category of categorizedKeywords) {
                const keyword = category.keywords.find(k => k.code === filterCode);
                if (keyword) {
                  label = keyword.name;
                  break;
                }
              }
              return (
                <div key={filterCode} className="flex items-center bg-primary-light text-white px-3 py-1 rounded-full">
                  <span>{label}</span>
                  <button className="ml-2 font-bold" onClick={() => toggleFilter(filterCode)}>
                    &times;
                  </button>
                </div>
              );
            })}
            <button className="ml-2 text-red-500 hover:underline" onClick={clearAllFilters}>
              {trans("clearAllFilters")}
            </button>
          </div>
        )}

        <div className="space-y-4">
          {results.length === 0 && <p>{trans("noResults")}</p>}
          {results.map((org) => (
            <OrganizationCard key={org.slug} organization={org} />
          ))}

        </div>
      </main>
    </div>
  );
}
