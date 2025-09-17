'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Keyword {
  code: string;
  name: string;
  category_code: string;
}

export default function OrganizationKeywordsAddPage() {
  const { slug } = useParams<{ slug: string }>();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = "fr"; // ou via next-intl/useLocale

    useEffect(() => {
        const fetchData = async () => {
        const [keywordsRes, orgRes] = await Promise.all([
            fetch(`http://localhost:8000/keywords?lang=${lang}`),
            fetch(`http://localhost:8000/organizations/${slug}?lang=${lang}`)
        ]);

        const keywordsData = await keywordsRes.json();
        const orgData = await orgRes.json();

        setKeywords(keywordsData);
        setSelected(orgData.keywords ?? []);
        setLoading(false);
        };
        fetchData();
    }, [slug, lang]);

    const handleAdd = async (kw: string) => {
        await fetch(`http://localhost:8000/organization/${slug}/keywords`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            keyword_code: kw,
            lang: lang
            })
        });
        setSelected(prev => [...prev, kw]);
    };


    if (loading) return <p>Chargement...</p>;

  // Regrouper par catégorie
  const grouped = keywords.reduce<Record<string, Keyword[]>>((acc, kw) => {
    acc[kw.category_code] = acc[kw.category_code] || [];
    acc[kw.category_code].push(kw);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Ajouter des mots-clés</h1>

      {Object.entries(grouped).map(([cat, kws]) => (
        <div key={cat} className="border rounded p-4">
          <h2 className="font-semibold mb-2">{cat}</h2>
          <div className="flex flex-wrap gap-2">
            {kws.map((kw) => {
              const isSelected = selected.includes(kw.code);
              return (
                <button
                  key={kw.code}
                  onClick={() => !isSelected && handleAdd(kw.code)}
                  className={`px-2 py-1 rounded text-sm ${
                    isSelected
                      ? "bg-green-200 text-green-800 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSelected ? `✅ ${kw.name}` : `➕ ${kw.name}`}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
