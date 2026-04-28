import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/ui/provider";
import { SearchBar } from "@/ui/bar";
import { Footer } from "@/ui/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  applicationName: "Uday",
  metadataBase: new URL("https://uday.app"),
  title: {
    default: "Uday | Shop Management",
    template: "%s | Uday",
  },
  description:
    "Create your electronics shop and manage inventory, billing, and sales.",
  keywords: [
    "Uday",
    "electronics shop",
    "mobile shop",
    "computer parts",
    "POS",
    "inventory management",
    "billing software",
    "shop management",
    "product catalog",
    "sales tracking",
    "retail software",
  ],
  category: "business",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Uday | Shop Management",
    description:
      "Create your electronics shop and manage inventory, billing, and sales.",
    siteName: "Uday",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Uday | Shop Management",
    description:
      "Create your electronics shop and manage inventory, billing, and sales.",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={inter.variable} lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <Provider>
          {children}
          {modal}
          <Footer />
          <SearchBar />
        </Provider>
      </body>
    </html>
  );
}
