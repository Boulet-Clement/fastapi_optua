'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations, useLocale } from 'next-intl';
import OrganizationSummary from '@/components/dashboard/organizations/details/OrganizationSummary';
import OrganizationKeywords from '@/components/dashboard/organizations/details/OrganizationKeywords';

interface Organization {
  organization_id: string;
  name: string;
  description?: string;
  is_visible: boolean;
  languages?: string[];
  keywords: string[];
  opening_hours?: { day: string; open: string; close: string }[];
}

export default function OrganizationDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const locale = useLocale();
  const trans = useTranslations('DashboardOrganizations');

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/organizations/${slug}?lang=${locale}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error(trans('fetch_error'));
        const data = (await res.json()) as Organization;
        console.log(data)
        setOrg(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchOrg();
  }, [slug, locale, trans]);

  return (
    <DashboardPageWrapper loading={loading} error={error} transKey="DashboardPageWrapper">
      {org ? (
        <div className="space-y-6">
          {/* Titre + bouton retour */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{org.name}</h1>
            <button
              onClick={() => router.back()}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Retour
            </button>
          </div>

          <OrganizationSummary
            name={org.name}
            description={org.description}
            isVisible={org.is_visible}
            onEdit={() => console.log('Edit')}
            onToggleVisibility={() => console.log('Toggle visibility')}
            trans={trans}
          />

          <OrganizationKeywords
            keywords={org.keywords ?? []}
            slug={slug}
            lang={locale}
          />
        </div>
      ) : (
        <p>{trans('details.no_data')}</p>
      )}
    </DashboardPageWrapper>
  );
}
