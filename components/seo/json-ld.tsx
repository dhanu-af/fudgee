// Renders a schema.org JSON-LD <script> block. Content is always
// server-built from our own DB fields (never raw user input), so
// JSON.stringify-into-a-script-tag is safe here.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
