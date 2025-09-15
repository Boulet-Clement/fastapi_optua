'use client';

import { useEffect, useState } from 'react';
import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import OrganizationForm from '@/components/forms/OrganizationForm';

interface Organization {
  organization_id: string;
  name: string;
  is_visible: boolean;
  languages?: string[]; // peut être undefined
}

const ALL_LANGS = ['fr', 'en', 'es', 'de']; // langues possibles

export default function OrganisationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const trans = useTranslations('DashboardOrganisations');
  const locale = useLocale();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch(`http://localhost:8000/organizations/mine?lang=${locale}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error(trans('fetch_error'));

        const data = await res.json();
        setOrgs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, [trans]);

  const handleAddTranslation = (org: Organization, lang: string) => {
    setSelectedOrg(org);
    setSelectedLang(lang);
  };

  const handleSuccess = (orgId: string) => {
    setSelectedOrg(null);
    setSelectedLang(null);
    // mettre à jour la liste locale avec la nouvelle langue
    setOrgs((prev) =>
      prev.map((o) =>
        o.organization_id === orgId
          ? { ...o, languages: [...(o.languages ?? []), selectedLang!] }
          : o
      )
    );
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // pour gérer les dropdowns

  return (
    <DashboardPageWrapper loading={loading} error={error} transKey="DashboardPageWrapper">
      {/* Header + bouton ajouter */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{trans('title')}</h1>
        <Link
          href={`/${locale}/dashboard/organisations/new`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {trans('add_organization')}
        </Link>
      </div>

      {/* Liste des organisations */}
      {orgs.length === 0 ? (
        <p className="text-gray-500 mt-4">{trans('no_organizations')}</p>
      ) : (
        <div className="space-y-6">
          {orgs.map((org) => {
            const orgLanguages = org.languages ?? [];
            const availableLanguages = ALL_LANGS.filter(
              (l) => !orgLanguages.includes(l)
            );

            return (
              <div
                key={org.organization_id}
                className="p-6 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
              >
                {/* Nom */}
                <h2 className="text-xl font-semibold mb-2">{org.name}</h2>

                {/* Langues existantes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {orgLanguages.map((lang) => (
                    <span
                      key={`${org.organization_id}-${lang}`}
                      className="px-2 py-1 bg-gray-200 rounded text-sm font-medium"
                    >
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Actions principales */}
                <div className="flex flex-wrap gap-3 relative">
                  <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                    {trans('edit')}
                  </button>
                  <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                    {org.is_visible ? trans('hide') : trans('publish')}
                  </button>

                  {/* Ajouter traduction si langues restantes */}
                  {availableLanguages.length > 0 && (
                    <div className="relative inline-block">
                      <button
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() =>
                          setOpenDropdown(openDropdown === org.organization_id ? null : org.organization_id)
                        }
                      >
                        ➕ {trans('add_translation')}
                      </button>

                      {openDropdown === org.organization_id && (
                        <ul className="absolute left-0 mt-1 bg-white border rounded shadow-lg z-10">
                          {availableLanguages.map((lang) => (
                            <li key={lang}>
                              <Link
                                href={`/${locale}/dashboard/organisations/new?orgId=${org.organization_id}&lang=${lang}`}
                                className="w-full block px-3 py-2 hover:bg-gray-100"
                              >
                                {lang.toUpperCase()}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                    📊 {trans('stats')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardPageWrapper>
  );
}
