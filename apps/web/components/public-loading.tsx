/** @jsxImportSource react */
export default function Loading({ section = 'page' }: { section?: string }) {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop" role="status" aria-label={`Loading ${section}`}>
      <p className="text-muted-ink">Loading {section}…</p>
      <div aria-hidden="true" className="mt-8 max-w-prose rounded-card border border-hairline bg-surface p-4 md:p-6">
        <div className="h-8 w-2/3 rounded-button bg-hairline" />
        <div className="mt-6 h-4 w-full rounded-button bg-hairline" />
        <div className="mt-3 h-4 w-5/6 rounded-button bg-hairline" />
      </div>
    </div>
  );
}
