'use client';

import { Edit, Eye, EyeOff } from 'lucide-react';
import Title2 from '@/components/ui/Titles/Title2';

interface Props {
  name: string;
  description?: string;
  isVisible: boolean;
  trans: (key: string) => string;
  onEdit: () => void;
  onToggleVisibility: () => void;
}

export default function OrganizationSummary({
  name,
  description,
  isVisible,
  trans,
  onEdit,
  onToggleVisibility,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start p-6 border rounded-lg bg-white shadow-sm space-y-6 md:space-y-0 md:space-x-6">
      {/* Infos principales */}
      <div className="flex-1 space-y-4">
        {/* Titre de la section */}
        <Title2>{trans('details.summary.title')}</Title2>

        {/* Champs */}
        <div>
          <span className="text-sm font-semibold text-gray-600">{trans('details.summary.name')}</span>
          <p className="mt-1 text-gray-800">{name}</p>
        </div>

        <div>
          <span className="text-sm font-semibold text-gray-600">{trans('details.summary.chapo')}</span>
          <p className="mt-1 text-gray-800">{name}</p> {/* Remplacer par vrai champ chapô si existant */}
        </div>

        {description && (
          <div>
            <span className="text-sm font-semibold text-gray-600">{trans('details.summary.description')}</span>
            <p className="mt-1 text-gray-800">{description}</p>
          </div>
        )}

        <div>
          <span className="text-sm font-semibold text-gray-600">{trans('details.summary.status')}</span>
          <p className={`mt-1 font-medium ${isVisible ? 'text-green-600' : 'text-red-600'}`}>
            {isVisible ? trans('details.summary.visible') : trans('details.summary.hidden')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark flex items-center gap-1"
        >
          <Edit size={16} /> {trans('details.summary.edit')}
        </button>
        <button
          onClick={onToggleVisibility}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          {isVisible ? trans('details.summary.hide') : trans('details.summary.publish')}
        </button>
      </div>
    </div>
  );
}
