'use client';

import OrganizationForm from '@/components/forms/OrganizationForm';
import { useTranslations, useLocale } from 'next-intl';

export default function NewOrganizationPage() {
  const trans = useTranslations('DashboardOrganisations');
  const locale = useLocale();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{trans('title')}</h1>
      <p className="mb-6 text-gray-700">
        {`Créez une nouvelle organisation. Remplissez les champs ci-dessous.`}
      </p>

      <OrganizationForm />
    </div>
  );
}
