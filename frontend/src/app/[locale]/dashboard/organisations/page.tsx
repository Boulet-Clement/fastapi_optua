'use client';

import { useEffect, useState } from 'react';
import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import OrganizationCard from '@/components/dashboard/OrganizationCard';

interface Organization {
  organization_id: string;
  name: string;
  is_visible: boolean;
  languages?: string[];
}

export default function OrganisationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trans = useTranslations('DashboardOrganisations');
  const locale = useLocale();

  const fetchOrgs = async () => {
    const res = await fetch(
      `http://localhost:8000/organizations/mine?lang=${locale}`,
      { credentials: 'include' }
    );
    if (!res.ok) throw new Error(trans('fetch_error'));
    return res.json() as Promise<Organization[]>;
  };

  const fetchLanguages = async () => {
    const res = await fetch(`http://localhost:8000/languages`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Impossible de charger les langues');
    return res.json() as Promise<string[]>;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgData, langData] = await Promise.all([
          fetchOrgs(),
          fetchLanguages(),
        ]);
        setOrgs(orgData);
        setAllLanguages(langData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [locale]);

  return (
    <DashboardPageWrapper loading={loading} error={error} transKey="DashboardPageWrapper">
      {/* Header */}
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
          {orgs.map((org) => (
            <OrganizationCard
              key={org.organization_id}
              org={org}
              trans={trans}
              locale={locale}
              allLanguages={allLanguages}
            />
          ))}
        </div>
      )}
    </DashboardPageWrapper>
  );
}
