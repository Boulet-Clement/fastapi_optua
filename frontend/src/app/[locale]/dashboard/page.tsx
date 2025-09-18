'use client';

import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations, useLocale } from 'next-intl';
import Title1 from '@/components/ui/Titles/Title1';

interface Props {
  userEmail?: string;
}

export default function DashboardHome({ userEmail }: Props) {
  const trans = useTranslations('DashboardHome');
  const locale = useLocale();

  return (
    <DashboardPageWrapper transKey="DashboardPageWrapper">
      <Title1>{trans('welcome')}</Title1>

      {userEmail && (
        <p className="text-gray-700 mb-4">
          {trans('connected_as')} <span className="font-medium">{userEmail}</span>
        </p>
      )}

      <p className="text-gray-600 mb-2">{trans('intro')}</p>
      <p className="text-gray-500">{trans('select_option')}</p>
    </DashboardPageWrapper>
  );
}
