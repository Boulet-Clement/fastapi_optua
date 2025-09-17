'use client';

import { useState } from "react";

interface Props {
  slug: string;
  lang: string;
  keywords: string[];
}

export default function OrganizationKeywords({ slug, lang, keywords: initialKeywords }: Props) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);

  const handleRemove = async (kw: string) => {
    try {
      const res = await fetch(`http://localhost:8000/organization/${slug}/keywords`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword_code: kw, lang })
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression du mot-clé");

      // Mise à jour locale immédiate
      setKeywords(prev => prev.filter(k => k !== kw));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le mot-clé");
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mots clefs</h3>
        <button
          // TODO: ajouter le bouton ➕ pour ajouter un mot-clé
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Liste */}
      {keywords.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun mot clef défini</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded text-sm"
            >
              {kw}
              <button
                onClick={() => handleRemove(kw)}
                className="hover:text-red-600"
              >
                ❌
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
