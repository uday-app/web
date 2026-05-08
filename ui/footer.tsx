"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-7xl p-4 items-center justify-between text-muted text-sm">
        <Link
          className="font-mono text-sm font-bold tracking-[0.18em] text-foreground select-none"
          href="/"
        >
          © 2026 UDAYAPP
        </Link>

        <Link className="transition hover:text-foreground" href="/terms">
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
}
