'use client';

interface Props {
  keywords: string[];
  onAdd: () => void;
  onRemove: (keyword: string) => void;
}

export default function OrganizationKeywords({ keywords, onAdd, onRemove }: Props) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mots clefs</h3>
        <button
          onClick={onAdd}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Liste */}
      {keywords.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun mot clef défini</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded text-sm"
            >
              {kw}
              <button
                onClick={() => onRemove(kw)}
                className="hover:text-red-600"
              >
                ❌
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
