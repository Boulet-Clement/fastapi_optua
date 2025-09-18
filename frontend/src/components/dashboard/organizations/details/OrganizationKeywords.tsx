'use client';

import { useState } from "react";
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useTranslations, useLocale } from 'next-intl';
import Keyword from "@/models/Keyword";

interface Props {
  slug: string;
  lang: string;
  keywords: Keyword[];
}

export default function OrganizationKeywords({ slug, lang, keywords: initialKeywords }: Props) {
  const trans = useTranslations('DashboardOrganizations.details.keywords');
  const locale = useLocale();
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);

  const handleRemove = async (kw: string) => {
    try {
      const res = await fetch(`http://localhost:8000/organization/${slug}/keywords`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword_code: kw, lang })
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression du mot-clé");

      // Mise à jour locale immédiate
      setKeywords(prev => prev.filter(k => k.code !== kw));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le mot-clé");
    }
  };


  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{trans('keywords')}</h2>
        <Link href={ROUTES.dashboard.organizations.new_keyword(locale, slug)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          ➕ {trans('button_add')}
        </Link>
      </div>

      {/* Liste */}
      {keywords.length === 0 ? (
        <p className="text-gray-500 text-sm">{trans('no_keywords')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword.code}
              className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded text-sm"
            >
              {keyword.name}
              <button
                onClick={() => handleRemove(keyword.code)}
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
