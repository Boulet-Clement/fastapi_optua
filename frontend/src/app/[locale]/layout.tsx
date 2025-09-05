import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { NextIntlClientProvider } from 'next-intl';
import Header from "@/components/Header";
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Optua",
  description: "Annuaire d'entreprises, clubs et associations",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!['fr','en'].includes(locale)) {
    notFound(); // ← rend automatiquement [locale]/not-found.tsx
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <Header/>
          <main>{children}</main>
        </NextIntlClientProvider>        
      </body>
    </html>
  );
}
