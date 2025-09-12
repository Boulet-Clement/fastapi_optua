'use client';

import { useEffect, useState } from 'react';
import DashboardPageWrapper from '@/components/DashboardPageWrapper';
import { useTranslations } from 'next-intl';

interface Organization {
  id: string;
  name: string;
  is_visible: boolean;
}

export default function OrganisationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trans = useTranslations('DashboardOrganisations');

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch('http://localhost:8000/organizations/mine', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(trans('fetch_error'));

        const data = await res.json();
        setOrgs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, [trans]);

  return (
    <DashboardPageWrapper loading={loading} error={error} transKey="DashboardPageWrapper">
      <h1 className="text-2xl font-bold mb-4">{trans('title')}</h1>

      {orgs.length === 0 ? (
        <p className="text-gray-500 mt-4">{trans('no_organizations')}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {orgs.map((org) => (
            <li
              key={org.id}
              className="p-4 border rounded-lg flex justify-between items-center hover:shadow-sm transition"
            >
              <span>{org.name}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  {trans('edit')}
                </button>
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  {org.is_visible ? trans('hide') : trans('publish')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardPageWrapper>
  );
}
