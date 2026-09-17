import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ViewportLock } from "@/components/utility/ViewportLock";

export const metadata: Metadata = {
  title: "Project 23",
  description: "For her.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-[#0E0B09] text-[#F5EFE6] select-none">
        <ViewportLock />
        {children}
      </body>
    </html>
  );
}
