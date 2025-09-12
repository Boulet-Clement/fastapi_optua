'use client';

import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations } from 'next-intl';

export default function BillingPage() {
  const trans = useTranslations('DashboardBilling');

  return (
    <DashboardPageWrapper transKey="DashboardPageWrapper">
      <h1 className="text-2xl font-bold mb-4">{trans('title')}</h1>
      <p className="text-gray-600">{trans('intro')}</p>
    </DashboardPageWrapper>
  );
}
