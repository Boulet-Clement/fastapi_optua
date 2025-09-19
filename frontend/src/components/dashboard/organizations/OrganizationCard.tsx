'use client';

import Link from 'next/link';
import Dropdown from '@/components/ui/Dropdown';
import { ROUTES } from '@/constants/routes';
import Title2 from '@/components/ui/Titles/Title2';

interface Organization {
  organization_id: string;
  name: string;
  is_visible: boolean;
  languages?: string[];
  slug: string;
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
      <Title2>{org.name}</Title2>

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
                    href={ROUTES.dashboard.organizations.new_translation(locale, org.organization_id)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    {lang.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </Dropdown>
        )}

        <Link
          href={ROUTES.dashboard.organizations.details(locale, org.slug)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          {trans('details_button')}
        </Link>

        <ActionButton>📊 {trans('stats')}</ActionButton>
      </div>
    </div>
  );
}
