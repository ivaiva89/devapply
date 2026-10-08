import Link from "next/link";
import type { ReactNode } from "react";

// Replaces Next's built-in 404, whose inline prefers-color-scheme style
// paints the body black beside a light-pinned app. Rendered inside the root
// layout, so it carries data-theme="light" and globals.css.
export default function NotFound(): ReactNode {
  return (
    <main className="px-8 pt-6 pb-12">
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Page not found
      </h1>
      <p className="text-text-2 mt-2">There is no page at this address.</p>
      <p className="mt-4">
        <Link
          href="/"
          className="text-primary hover:text-primary-hover underline"
        >
          Back to the start page
        </Link>
      </p>
    </main>
  );
}
