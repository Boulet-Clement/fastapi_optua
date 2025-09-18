'use client';

import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations } from 'next-intl';
import Title1 from '@/components/ui/Titles/Title1';

export default function SettingsPage() {
  const trans = useTranslations('DashboardSettings');

  return (
    <DashboardPageWrapper transKey="DashboardPageWrapper">
      <Title1>{trans('title')}</Title1>
      <p className="text-gray-600">{trans('intro')}</p>
    </DashboardPageWrapper>
  );
}
