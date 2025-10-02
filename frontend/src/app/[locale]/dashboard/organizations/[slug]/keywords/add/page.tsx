'use client';

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Plus, X, Undo2, ChevronDown, ChevronRight, Search, CheckCircle, AlertCircle } from "lucide-react";
import Title1 from '@/components/ui/Titles/Title1';
import Title2 from '@/components/ui/Titles/Title2';

interface Keyword {
  code: string;
  name: string;
  category_code: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const normalize = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function OrganizationKeywordsAddPage() {
  const { slug } = useParams<{ slug: string }>();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Toasts stack
  const [toasts, setToasts] = useState<Toast[]>([]);

  const locale = useLocale();
  const trans = useTranslations('DashboardOrganizations.details.keywords.add');
  const router = useRouter();

  // 🔹 Ajoute un toast à la pile
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000); // 3 secondes
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keywordsRes, orgRes] = await Promise.all([
          fetch(`http://localhost:8000/keywords?lang=${locale}`),
          fetch(`http://localhost:8000/organizations/${slug}?lang=${locale}`)
        ]);
        const keywordsData = await keywordsRes.json();
        const orgData = await orgRes.json();
        setKeywords(keywordsData);
        setSelected(orgData.keywords ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, locale]);

  const handleAdd = async (kw: string) => {
    try {
      const res = await fetch(`http://localhost:8000/organization/${slug}/keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword_code: kw, lang: locale })
      });
      if (!res.ok) throw new Error();
      setSelected(prev => [...prev, kw]);
      showToast("Mot-clé ajouté", "success");
    } catch {
      showToast("Erreur lors de l’ajout", "error");
    }
  };

  const handleRemove = async (kw: string) => {
    try {
      const res = await fetch(`http://localhost:8000/organization/${slug}/keywords`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword_code: kw, lang: locale })
      });
      if (!res.ok) throw new Error();
      setSelected(prev => prev.filter(k => k !== kw));
      showToast("Mot-clé supprimé", "success");
    } catch {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const grouped = useMemo(() => {
    return keywords.reduce<Record<string, Keyword[]>>((acc, kw) => {
      acc[kw.category_code] = acc[kw.category_code] || [];
      acc[kw.category_code].push(kw);
      return acc;
    }, {});
  }, [keywords]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return [];
    return keywords.filter(kw =>
      normalize(kw.name).includes(term) || normalize(kw.code).includes(term)
    );
  }, [keywords, search]);

  if (loading) return <p className="p-4 text-gray-500">Chargement...</p>;

  return (
    <div className="lg:pl-8 pt-8 space-y-6 relative">

      {/* ✅ Toast Stack */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-md text-white flex items-center gap-2 transition-all duration-300 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Title1>{trans('add_keywords')}</Title1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition cursor-pointer"
        >
          <Undo2 size={16} /> {trans('back')}
        </button>
      </div>

      {/* Texte explicatif */}
      <p className="text-sm text-gray-500">
        Cliquez sur un mot-clé pour l’ajouter ou le retirer. Les modifications sont enregistrées automatiquement.
      </p>

      {/* Barre de recherche */}
      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un mot-clé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Résultats */}
      {search.trim() !== "" && (
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="w-full flex justify-between items-center px-4 py-3 bg-gray-50">
            <Title2 className="text-primary">Résultats</Title2>
          </div>
          <div className="p-4">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun résultat</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filtered.map((kw) => {
                  const isSelected = selected.includes(kw.code);
                  const toggle = () =>
                    isSelected ? handleRemove(kw.code) : handleAdd(kw.code);
                  return (
                    <button
                      key={kw.code}
                      onClick={toggle}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border text-md transition cursor-pointer ${
                        isSelected
                          ? "bg-primary border-primary text-white hover:text-red"
                          : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-primary-light hover:text-white hover:border-primary"
                      }`}
                    >
                      <span>{kw.name}</span>
                      {isSelected ? <X size={14} /> : <Plus size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accordéons */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([cat, kws]) => {
          const isOpen = openCategories.includes(cat);
          return (
            <div key={cat} className="border rounded-lg bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left cursor-pointer"
              >
                <Title2 className="text-primary">
                  {trans(`categories.${cat}`, { defaultMessage: cat })}
                </Title2>
                {isOpen ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ${
                  isOpen ? "max-h-96 p-4 opacity-100" : "max-h-0 p-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="flex flex-wrap gap-2">
                  {kws.map((kw) => {
                    const isSelected = selected.includes(kw.code);
                    const toggle = () =>
                      isSelected ? handleRemove(kw.code) : handleAdd(kw.code);
                    return (
                      <button
                        key={kw.code}
                        onClick={toggle}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border text-md transition cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-white hover:text-red"
                            : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-primary-light hover:text-white hover:border-primary"
                        }`}
                      >
                        <span>{kw.name}</span>
                        {isSelected ? <X size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
