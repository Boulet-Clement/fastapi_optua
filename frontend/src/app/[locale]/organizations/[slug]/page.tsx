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
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!slug) return;
    const confirmDelete = window.confirm(trans('delete.confirm_message') || 'Supprimer cette organisation ?');
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/organizations/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(trans('delete.error_message') || 'Erreur lors de la suppression');
      
      alert(trans('delete.success_message') || 'Organisation supprimée avec succès');
      router.push(ROUTES.dashboard.organizations.index(locale));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
          {/* Titre + bouton retour */}
          <div className="flex items-center justify-between mb-4">
            <Title1>aaze</Title1>
            <Link
              href={ROUTES.dashboard.organizations.index(locale)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
            >
              <Undo2 size={16} /> {trans('back')}
            </Link>
          </div>


            <div className="mx-auto min-h-[75vh] flex flex-col lg:flex-row">
              <AThird/>
              <TwoThirds/>
            </div>
      
        </div>
    
  );
}
