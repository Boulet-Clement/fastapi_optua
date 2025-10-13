import sanitizeHtml from 'sanitize-html';

interface Props {
  description?: string;
}

export default function DescriptionTab({ description }: Props) {
  if (!description) return null;
  const sanitizedDescription = sanitizeHtml(description, {
    allowedTags: [
      "p", "b", "i", "em", "strong", "u", "ul", "ol", "li",
      "h1", "h2", "h3", "blockquote", "br", "span"
    ],
    allowedSchemes: ["http", "https", "mailto"],
  });

  return (
    <div className="tab-content">
      <div className="lg:px-8 text-gray-800 leading-relaxed">
        <div dangerouslySetInnerHTML={{__html: sanitizedDescription}}/>
        <p>{sanitizedDescription}</p>
      </div>
    </div>
  );
}
