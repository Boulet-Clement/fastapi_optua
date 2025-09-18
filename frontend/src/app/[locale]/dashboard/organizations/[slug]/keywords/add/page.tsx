'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import Title1 from '@/components/ui/Titles/Title1';

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
  const locale = useLocale();
  const trans = useTranslations('DashboardOrganizations.details.keywords.add');

  useEffect(() => {
    const fetchData = async () => {
      const [keywordsRes, orgRes] = await Promise.all([
        fetch(`http://localhost:8000/keywords?lang=${locale}`),
        fetch(`http://localhost:8000/organizations/${slug}?lang=${locale}`)
      ]);

      const keywordsData = await keywordsRes.json();
      const orgData = await orgRes.json();

      setKeywords(keywordsData);
      setSelected(orgData.keywords ?? []);
      setLoading(false);
    };
      fetchData();
    }, [slug, locale]);

    const handleAdd = async (kw: string) => {
        await fetch(`http://localhost:8000/organization/${slug}/keywords`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            keyword_code: kw,
            lang: locale
            })
        });
        setSelected(prev => [...prev, kw]);
    };

    const router = useRouter();


    if (loading) return <p>Chargement...</p>;

  // Regrouper par catégorie
  const grouped = keywords.reduce<Record<string, Keyword[]>>((acc, kw) => {
    acc[kw.category_code] = acc[kw.category_code] || [];
    acc[kw.category_code].push(kw);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <Title1>{trans('add_keywords')}</Title1>
        <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            {trans('back')}
          </button>
      </div>
      

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
