'use client';

import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations } from 'next-intl';
import Title1 from '@/components/ui/Titles/Title1';

export default function BillingPage() {
  const trans = useTranslations('DashboardBilling');

  return (
    <DashboardPageWrapper transKey="DashboardPageWrapper">
      <Title1>{trans('title')}</Title1>
      <p className="text-gray-600">{trans('intro')}</p>
    </DashboardPageWrapper>
  );
}
