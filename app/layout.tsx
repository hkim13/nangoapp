import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { GooglePickerScripts } from "@/components/google-picker-scripts";

// Load local fonts with size optimization
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Optimize font display
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap", // Optimize font display
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "Seamless AI | Automate your business",
    template: "%s | Seamless AI",
  },
  description: "Automate your business with AI agents that integrate with your tools",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://seamlessai.app"
  ),
  keywords: ["AI", "automation", "business", "agents", "integration", "seamless"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Seamless AI | Automate your business",
    description: "Automate your business with AI agents that integrate with your tools",
    siteName: "Seamless AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Seamless AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seamless AI | Automate your business",
    description: "Automate your business with AI agents that integrate with your tools",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/color_logo_no_background.png",
        type: "image/png",
      }
    ],
    shortcut: ["/color_logo_no_background.png"],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      }
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
        <GooglePickerScripts />
      </body>
    </html>
  );
}
