'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { API_ROUTES } from '@/constants/api_routes';

interface Props {
  onSuccess?: (orgId: string) => void;
  initialLang?: string; // langue initiale (ex: pour traduction)
  organizationId?: string; // structure cible si c’est une traduction
}

export default function OrganizationForm({ onSuccess, initialLang, organizationId }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trans = useTranslations('DashboardOrganizations.new');
  const locale = useLocale();

  // La langue à utiliser
  const lang = initialLang ?? locale;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ROUTES.organizations.index, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          lang,
          ...(organizationId ? { organization_id: organizationId } : {}),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || trans('submit_error'));
      }

      const data = await res.json();
      if (onSuccess) onSuccess(data.organization_id);

      setName('');
      setDescription('');
      setKeywords('');
    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">{trans('create_organization')}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{trans('name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{trans('description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{trans('keywords')}</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{trans('language')}</label>
          <select
            value={lang}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          >
            <option value="fr">{trans('french')}</option>
            <option value="en">{trans('english')}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
        >
          {loading ? trans('creating') : trans('create')}
        </button>
      </form>
    </div>
  );
}
