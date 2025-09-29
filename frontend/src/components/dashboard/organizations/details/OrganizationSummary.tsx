'use client';

import { useState } from 'react';
import { Edit, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import Title2 from '@/components/ui/Titles/Title2';
import Organization from '@/models/Organization';
import { useTranslations, useLocale } from 'next-intl';

interface Props {
  organization: Organization
}

	export default function OrganizationSummary({ organization }: Props) {
		const locale = useLocale();
		const trans = useTranslations('DashboardOrganizations');
		const [org, setOrg] = useState(organization); // ✅ état local pour mettre à jour dynamiquement
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState<string | null>(null);

		const onToggleVisibility = async () => {
		setLoading(true);
		setError(null);
		try {
			const newVisibility = !org.is_hidden;

			const res = await fetch(`http://localhost:8000/organization/${org.slug}/summary`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				lang: org.lang,          // ⚠️ toujours envoyer la langue
				is_hidden: newVisibility // ✅ seul champ qu’on change
			}),
			});

			if (!res.ok) {
			const err = await res.json();
			throw new Error(err.detail || "Erreur de mise à jour");
			}

			const data = await res.json();

			// 🔥 on récupère la nouvelle version depuis le back
			setOrg(data.organization);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

  return (
    <div className="flex flex-col md:flex-row justify-between items-start p-6 border rounded-lg bg-white shadow-sm space-y-6 md:space-y-0 md:space-x-6">
      <div className="flex-1 space-y-4 w-full">
        <div className="flex justify-between items-center">
          <Title2>{trans('details.summary.title')}</Title2>
          <Link
            href={ROUTES.dashboard.organizations.edit_summary(locale, org.slug)}
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark flex items-center gap-1"
          >
            <Edit size={16} /> {trans('details.summary.button_edit')}
          </Link>
        </div>

        {/* Champs */}
        <div>
          <span className="text-sm font-semibold text-gray-600">{trans('details.summary.name')}</span>
          <p className="mt-1 text-gray-800">{org.name}</p>
        </div>

        <div>
          <span className="text-sm font-semibold text-gray-600">{trans('details.summary.chapo')}</span>
          <p className="mt-1 text-gray-800">{org.chapo?org.chapo:'...'}</p>
        </div>

        {org.description && (
          <div>
            <span className="text-sm font-semibold text-gray-600">{trans('details.summary.description')}</span>
            <p className="mt-1 text-gray-800">{org.description}</p>
          </div>
        )}

        <div>
          <span className="text-sm font-semibold text-gray-600">{trans('details.summary.status')}</span>
          <div className="mt-1 flex items-center justify-between">
            <p
              className={`font-medium ${
                org.is_hidden ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {org.is_hidden
                ? trans('details.summary.hidden')
                : trans('details.summary.visible')}
            </p>
            <button
              onClick={onToggleVisibility}
              disabled={loading}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1 text-sm 
              disabled:opacity-50 cursor-pointer"
            >
              {org.is_hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              {loading
                ? '...'
                : org.is_hidden
                ? trans('details.summary.publish')
                : trans('details.summary.hide')}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
