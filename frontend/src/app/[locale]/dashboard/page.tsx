'use client';

import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations } from 'next-intl';
import Title1 from '@/components/ui/Titles/Title1';

export default function DashboardHome() {
  const trans = useTranslations('DashboardHome');

  return (
    <DashboardPageWrapper transKey="DashboardPageWrapper">
      <Title1>{trans('welcome')}</Title1>

      <p className="text-gray-600 mb-2">{trans('intro')}</p>
      <p className="text-gray-500">{trans('select_option')}</p>
    </DashboardPageWrapper>
  );
}
