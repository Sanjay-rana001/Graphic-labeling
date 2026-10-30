import LandingClient from "../components/LandingClient";

export const metadata = {
  title:
    "Sourav Graphic & Metal Label | B2B Industrial Nameplates, SS 304 Tags & Stickers",
  description:
    "Factory-direct B2B manufacturer of Anodized Aluminium Nameplates, SS 304/316 Etched Plates, QR/Barcode Metal Tags, Brass Signage & Polycarbonate Stickers.",
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Manufacturer",
  name: "Sourav Graphic & Metal Label",
  description:
    "B2B OEM & Wholesale Manufacturer of Anodized Aluminium Nameplates, SS 304/316 Chemical Etched Plates, QR/Barcode Metal Tags, Brass Signage & Polycarbonate Labels.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://souravgraphic.in",
  logo: "/Media/Logo.png",
  image: "/Media/metal labels.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  makesOffer: [
    "Aluminium Name Plate",
    "Anodized Aluminium Tag",
    "Aluminium Etching Plate",
    "QR & Barcode Metal Tag",
    "SS 304 Etched Plate",
    "Brass & Gold Plate",
    "Polycarbonate Sticker",
    "Acrylic Sign Board",
    "Danger & Safety Plate",
    "CNG Compliance Plate",
    "Cabin & Door Plate",
    "Inspection Punch Tag",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name,
      brand: "Sourav Graphic & Metal Label",
    },
  })),
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <LandingClient />
    </main>
  );
}
