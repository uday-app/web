"use client";

import { ThemeProvider } from "next-themes";

import { AuthSync } from "@/ui/auth/session-sync";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      enableColorScheme
      enableSystem
      attribute="class"
      defaultTheme="system"
    >
      <AuthSync />
      {children}
    </ThemeProvider>
  );
}
