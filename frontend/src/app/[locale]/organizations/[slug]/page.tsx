'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations, useLocale } from 'next-intl';
import OrganizationSummary from '@/components/dashboard/organizations/details/OrganizationSummary';
import OrganizationKeywords from '@/components/dashboard/organizations/details/OrganizationKeywords';
import Organization from '@/models/Organization';
import Title1 from '@/components/ui/Titles/Title1';
import { Undo2, Trash2 } from "lucide-react";
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import AThird from '@/components/organizations/AThird';
import TwoThirds from '@/components/organizations/TwoThirds';

interface Keyword {
  code: string,
  lang: string
}

/*interface Organization {
  organization_id: string;
  name: string;
  description?: string;
  is_visible: boolean;
  languages?: string[];
  keywords: string[];
  keywords_details: Keyword[]
  opening_hours?: { day: string; open: string; close: string }[];
}*/

export default function OrganizationDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const locale = useLocale();
  const trans = useTranslations('DashboardOrganizations.details');

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

  if (loading) {
    return <div className="p-6 text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!org) {
    return <div className="p-6 text-center">Organisation introuvable</div>;
  }

  return (
    <div className="mx-auto min-h-[75vh] flex flex-col lg:flex-row">
      <AThird organization={org} />
      <TwoThirds organization={org} />
    </div>
  );
}
