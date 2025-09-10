'use client';

import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
  tags?: string[];
}

const API_BASE = "http://localhost:8000";

type SearchParams = {
  lang: string;
  all_tags_required: boolean;
  query?: string;
  tags?: string[];
};

export default function SearchEnginePage() {
  const locale = useLocale();
  const trans = useTranslations("Search");

  const [categorizedTags, setCategorizedTags] = useState<CategoryTag[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allTagsRequired, setAllTagsRequired] = useState<boolean>(false);

  const fetchCategorizedTags = useCallback(async () => {
    try {
      const response: AxiosResponse<CategoryTag[]> = await axios.get(
        `${API_BASE}/filters`,
        { params: { lang: locale } }
      );
      setCategorizedTags(response.data);
    } catch (error) {
      console.error("Erreur API:", error);
      setCategorizedTags([]);
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
        const allRequiredValue = allRequired ?? allTagsRequired;

        const params: SearchParams = {
          lang: locale,
          all_tags_required: allRequiredValue,
        };
        if (q) params.query = q;
        if (f.length) params.tags = f;

        if (updateURL) {
          const urlParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) value.forEach(v => urlParams.append(key, v));
            else if (value !== undefined) urlParams.append(key, String(value));
          });
          window.history.replaceState({}, "", `?${urlParams.toString()}`);
        }

        const response: AxiosResponse<SearchResult[]> = await axios.get(
          `${API_BASE}/search`,
          {
            params,
            paramsSerializer: (p: SearchParams) => {
              const searchParams = new URLSearchParams();
              Object.entries(p).forEach(([key, value]) => {
                if (Array.isArray(value)) value.forEach(v => searchParams.append(key, v));
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
    [search, activeFilters, allTagsRequired, locale]
  );

  useEffect(() => {
    fetchCategorizedTags();

    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("query") || "";
    const tagsParam = params.getAll("tags");
    const allRequiredParam = params.get("all_tags_required") === "true";

    setSearch(queryParam);
    setActiveFilters(tagsParam);
    setAllTagsRequired(allRequiredParam);

    const fetchInitialResults = async () => {
      try {
        const response = await axios.get<SearchResult[]>(`${API_BASE}/search`, {
          params: {
            lang: locale,
            query: queryParam || undefined,
            tags: tagsParam.length ? tagsParam : undefined,
            all_tags_required: allRequiredParam,
          },
          paramsSerializer: (p: SearchParams) => {
            const searchParams = new URLSearchParams();
            Object.entries(p).forEach(([key, value]) => {
              if (Array.isArray(value)) value.forEach(v => searchParams.append(key, v));
              else if (value !== undefined) searchParams.append(key, String(value));
            });
            return searchParams.toString();
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Erreur recherche initiale:", error);
        setResults([]);
      }
    };

    fetchInitialResults();
  }, [locale, fetchCategorizedTags]);

  const toggleFilter = (tagCode: string) => {
    const newFilters = activeFilters.includes(tagCode)
      ? activeFilters.filter(t => t !== tagCode)
      : [...activeFilters, tagCode];
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
    <div className="w-full min-h-screen flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 space-y-6">
        <div className="sticky top-4 flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded shadow">
          <input
            type="checkbox"
            id="all-tags-required"
            checked={allTagsRequired}
            onChange={e => {
              setAllTagsRequired(e.target.checked);
              submitSearch(undefined, undefined, true, e.target.checked);
            }}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="all-tags-required" className="text-sm font-medium">
            {trans("toggleAllTagsRequired")}
          </label>
        </div>

        {categorizedTags.map(category => (
          <details key={category.code} className="bg-white rounded shadow" open>
            <summary className="cursor-pointer font-semibold px-4 py-2 border-b hover:bg-gray-50 transition">
              {category.category_name}
            </summary>
            <div className="p-4 space-y-2">
              {category.tags.map(tag => (
                <label
                  key={tag.code}
                  className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                >
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
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 placeholder-gray-400"
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
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {trans("searchButton")}
          </button>
        </form>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filterCode => {
              let label = "";
              for (const category of categorizedTags) {
                const tag = category.tags.find(t => t.code === filterCode);
                if (tag) {
                  label = tag.name;
                  break;
                }
              }
              return (
                <div key={filterCode} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
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
          {results.map(result => (
            <a key={result._id} href={result.url} target="_blank" className="block">
              <div className="flex flex-col sm:flex-row items-start bg-white p-4 rounded shadow gap-4 hover:shadow-lg transition">
                {/* Bloc texte simplifié, plus d'image */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{result.name}</h3>
                  <p className="text-gray-700 truncate">{result.chapo}</p>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.map(tag => (
                        <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
