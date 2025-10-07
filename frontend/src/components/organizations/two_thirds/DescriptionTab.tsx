interface Props {
  description?: string;
}

export default function DescriptionTab({ description }: Props) {
  if (!description) return null;

  return (
    <div className="tab-content">
      <div className="lg:px-8 text-gray-800 leading-relaxed">
        <p>{description}</p>
      </div>
    </div>
  );
}
