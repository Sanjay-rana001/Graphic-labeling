import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import MetalScrollToTop from "../components/MetalScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://souravgraphic.in"
  ),
  title: {
    default: "Sourav Graphic & Metal Label | B2B Industrial Nameplate & Tag Manufacturer",
    template: "%s | Sourav Graphic & Metal Label",
  },
  description:
    "India's trusted B2B manufacturer & exporter of Anodized Aluminium Nameplates, SS 304/316 Etched Tags, Brass Boards, QR/Barcode Cable Tags, Polycarbonate Stickers & Industrial Screen Printing.",
  keywords: [
    "Sourav Graphic",
    "Metal Label Manufacturer India",
    "Anodized Aluminium Nameplate",
    "SS 304 Etched Nameplate",
    "QR Barcode Metal Tag",
    "Industrial Rating Plates",
    "Polycarbonate Stickers",
    "Brass Signage Boards",
    "CNG Compliance Plate",
  ],
  openGraph: {
    title: "Sourav Graphic & Metal Label | B2B Industrial Nameplate Manufacturer",
    description:
      "Bulk OEM & wholesale manufacturer of Anodized Aluminium Nameplates, SS 304 Etched Plates, QR/Barcode Tags & Polycarbonate Labels.",
    type: "website",
    locale: "en_IN",
    siteName: "Sourav Graphic & Metal Label",
    images: [
      {
        url: "/Media/metal labels.jpg",
        width: 1200,
        height: 630,
        alt: "Sourav Graphic & Metal Label Industrial Specimens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sourav Graphic & Metal Label | B2B Industrial Nameplate Manufacturer",
    description:
      "Bulk OEM manufacturer of Anodized Aluminium Nameplates, SS 304 Etched Tags & Industrial Labels.",
    images: ["/Media/metal labels.jpg"],
  },
  icons: {
    icon: "/Media/Logo.png",
    apple: "/Media/Logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <MetalScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
