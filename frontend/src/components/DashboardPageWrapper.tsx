'use client';

import { ReactNode } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DashboardPageWrapperProps {
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  transKey?: string; // clé de traduction pour ce composant
}

export default function DashboardPageWrapper({
  children,
  loading = false,
  error = null,
  transKey = 'DashboardPageWrapper',
}: DashboardPageWrapperProps) {
  const trans = useTranslations(transKey);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-2 text-primary">{trans('loading')}</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-red-600">
        <AlertCircle className="w-8 h-8 mr-2" />
        {error}
      </div>
    );

  return <div className="p-8">{children}</div>;
}
