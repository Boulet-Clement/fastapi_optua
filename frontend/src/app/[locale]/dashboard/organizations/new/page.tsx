'use client';

import OrganizationForm from '@/components/forms/OrganizationForm';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { ROUTES } from '@/constants/routes';
import Title1 from '@/components/ui/Titles/Title1';

export default function NewOrganizationPage() {
  const trans = useTranslations('DashboardOrganizations');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [flash, setFlash] = useState<string | null>(null);

  const organizationId = searchParams.get('organizationId') || undefined;
  const initialLang = searchParams.get('lang') || undefined;

  return (
    <DashboardPageWrapper loading={false} error={null} transKey="DashboardPageWrapper">
      <div className="p-8">
        {/* Titre + bouton Annuler */}
        <div className="flex items-center justify-between mb-4">
          
          <Title1>{trans('title')}</Title1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            {trans('cancel')}
          </button>
        </div>

        {/* Flash message */}
        {flash && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
            {flash}
          </div>
        )}

        {/* Formulaire */}
        <OrganizationForm
          initialLang={initialLang}
          organizationId={organizationId}
          onSuccess={(orgId: string) => {
            setFlash(`Structure créée avec succès !`);
            setTimeout(() => router.push(ROUTES.dashboard.organizations.index(locale)), 1500);
          }}
        />
      </div>
    </DashboardPageWrapper>
  );
}
