'use client';
/** @jsxImportSource react */

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-reading px-gutter-mobile py-12 md:px-gutter-desktop" role="alert">
      <h1 className="text-heading">This page is unavailable</h1>
      <p className="mt-4 max-w-prose text-muted-ink">Something went wrong while opening this page. Please try again.</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="inline-flex min-h-11 min-w-11 items-center rounded-button bg-action-blue px-4 py-2 font-bold text-white">
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-11 min-w-11 items-center font-bold text-action-blue underline">Go back home</Link>
      </div>
    </div>
  );
}
