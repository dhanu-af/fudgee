// Renders a schema.org JSON-LD <script> block. The data itself is
// server-built from our own DB fields rather than a live attacker request,
// but it does include free-text admin-editable fields (product
// name/description, contact address, social links) — escaping "</" stops
// any of those ever breaking out of the script tag early.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
