import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Director } from "@/director/Director";
import { site } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = { title: `${site.name} — ${site.strap}`, description: site.lede, authors: [{ name: site.author.name }] };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="paper" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Courier+Prime:wght@400;700&family=Hanken+Grotesk:wght@300..800&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem("hl-theme")||"paper"}catch(e){}` }} />
      </head>
      <body className="antialiased"><Director>{children}</Director></body>
    </html>
  );
}
