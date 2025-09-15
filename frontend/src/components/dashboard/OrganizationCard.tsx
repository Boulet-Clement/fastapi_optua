'use client';

import Link from 'next/link';
import Dropdown from '@/components/ui/Dropdown';

interface Organization {
  organization_id: string;
  name: string;
  is_visible: boolean;
  languages?: string[];
}

const ActionButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
  >
    {children}
  </button>
);

interface Props {
  org: Organization;
  trans: (key: string) => string;
  locale: string;
  allLanguages: string[];
}

export default function OrganizationCard({ org, trans, locale, allLanguages }: Props) {
  const orgLanguages = org.languages ?? [];
  const availableLanguages = allLanguages.filter(
    (lang) => !orgLanguages.includes(lang)
  );

  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition bg-white">
      {/* Nom */}
      <h2 className="text-xl font-semibold mb-2">{org.name}</h2>

      {/* Langues existantes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {orgLanguages.map((lang) => (
          <span
            key={`${org.organization_id}-${lang}`}
            className="px-2 py-1 bg-gray-200 rounded text-sm font-medium"
          >
            {lang.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Actions principales */}
      <div className="flex flex-wrap gap-3 relative">
        <ActionButton>{trans('edit')}</ActionButton>
        <ActionButton>
          {org.is_visible ? trans('hide') : trans('publish')}
        </ActionButton>

        {/* Ajouter traduction */}
        {availableLanguages.length > 0 && (
          <Dropdown
            trigger={
              <ActionButton>➕ {trans('add_translation')}</ActionButton>
            }
          >
            <ul className="flex flex-col">
              {availableLanguages.map((lang) => (
                <li key={lang}>
                  <Link
                    href={`/${locale}/dashboard/organisations/new?orgId=${org.organization_id}&lang=${lang}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    {lang.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </Dropdown>
        )}

        <ActionButton>📊 {trans('stats')}</ActionButton>
      </div>
    </div>
  );
}
