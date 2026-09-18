import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/utility/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "for zaara",
  description: "a letter, for zaara",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "for zaara",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E0B09",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden bg-[#0E0B09]">
      <head>
        <meta name="theme-color" content="#0E0B09" id="meta-theme-color" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="for zaara" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Caveat:wght@400;600;700&family=Noto+Serif+Devanagari:wght@400;500;600&family=Noto+Nastaliq+Urdu:wght@400;600&display=swap" />
      </head>
      <body className="antialiased fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-[#0E0B09] text-[#F5EFE6] transition-colors duration-300">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
