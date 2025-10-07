interface Props {
  location?: string;
}

export default function LocationTab({ location }: Props) {
  return (
    <div id="content-location" className="tab-content lg:px-8">
      {location ? (
        <p className="text-gray-700">Adresse : {location}</p>
      ) : (
        <p className="text-gray-400 italic">
          Aucune adresse disponible.
        </p>
      )}
    </div>
  );
}
