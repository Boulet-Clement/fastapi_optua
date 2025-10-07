import Menu from "@/models/Menu";

interface Props {
  menu?: Menu;
}

export default function MenuTab({ menu }: Props) {
  if (!menu) return null;

  return (
    <div id="content-menu" className="tab-content">
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-xl font-bold mb-8">{menu.title || "Carte du restaurant"}</h1>

        {menu.categories?.length ? (
          menu.categories.map((cat) => (
            <div key={cat.name} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {cat.name}
              </h2>
              {cat.notes && (
                <p className="text-sm text-gray-500 mb-2">{cat.notes}</p>
              )}

              <div className="grid gap-4">
                {cat.items?.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center bg-white shadow-md rounded-xl p-4"
                  >
                    <div>
                      <h3 className="text-md font-medium text-gray-900">
                        {item.name}
                      </h3>
                      {item.ingredients && (
                        <p className="text-sm text-gray-600">
                          {item.ingredients}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.price !== undefined && (
                        <p className="text-md font-semibold text-gray-800">
                          {item.price.toFixed(2)} €
                        </p>
                      )}
                      {item.available === false && (
                        <span className="text-xs text-red-500">
                          Non disponible
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">
            Aucune catégorie disponible.
          </p>
        )}
      </div>
    </div>
  );
}
