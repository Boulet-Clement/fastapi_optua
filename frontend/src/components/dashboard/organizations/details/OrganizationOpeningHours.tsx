'use client';
import { useTranslations, useLocale } from 'next-intl';

interface Props {
  hours: { day: string; open: string; close: string }[];
  onEdit: () => void;
}

export default function OrganizationOpeningHours({ hours, onEdit }: Props) {
  const trans = useTranslations('DashboardOrganizations.details.opening_hours');
  const locale = useLocale();
  
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{trans('title')}</h3>
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {trans('modify')}
        </button>
      </div>

      <ul className="space-y-1">
        {hours.map(({ day, open, close }) => (
          <li key={day} className="text-sm">
            <span className="font-medium">{day} :</span> {open} – {close}
          </li>
        ))}
      </ul>
    </div>
  );
}
