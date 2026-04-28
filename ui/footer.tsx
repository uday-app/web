"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-foreground/68 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="font-mono text-sm font-bold tracking-[0.18em] text-foreground select-none"
          href="/"
        >
          UDAYAPP
        </Link>

        <div className="flex items-center gap-4">
          <p className="select-none text-foreground/52">© 2026 UDAYAPP</p>
          <Link className="transition hover:text-foreground" href="/terms">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
