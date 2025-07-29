import "./globals.css";
import { Prompt, Inter, Kanit } from "next/font/google";
import LayoutWrapper from "../components/LayoutWrapper";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Ruby's Real Estate Phuket | Luxury Properties in Thailand",
    template: "%s | Ruby's Real Estate Phuket"
  },
  description: "Ruby's Real Estate Phuket - Specialist in luxury villas, condos and land for sale in Phuket, Thailand. Contact us at 093-781-2945.",
  keywords: [
    "Ruby's Real Estate Phuket",
    "Real estate Phuket",
    "Property for sale Phuket",
    "Luxury villas Phuket",
    "Phuket real estate agent"
  ],
  icons: {
    icon: "/logo3.jpg",
    apple: "/logo3.jpg",
    shortcut: "/logo3.jpg"
  },
  openGraph: {
    title: "Ruby's Real Estate Phuket | Luxury Properties in Thailand",
    description: "Specialist in luxury properties in Phuket, Thailand. Contact: 093-781-2945",
    url: "https://www.ruby-realestate.com",
    siteName: "Ruby's Real Estate Phuket",
    images: [
      {
        url: "https://www.ruby-realestate.com/logo3.jpg", 
        width: 1200,
        height: 630,
        alt: "Ruby's Real Estate Phuket Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.ruby-realestate.com",
  },
  metadataBase: new URL("https://www.ruby-realestate.com"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Ruby's Real Estate Phuket",
    "image": "https://www.ruby-realestate.com/logo3.jpg", 
    "url": "https://www.ruby-realestate.com",
    "telephone": "+66937812945",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "111/151 Moo 4 Supalai bella, Kohkeaw, Muang, Phuket 83000",
      "addressLocality": "Phuket",
      "postalCode": "83000",
      "addressCountry": "TH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "7.8804",
      "longitude": "98.3923"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <html
      lang="en"
      className={`${prompt.variable} ${kanit.variable} ${inter.variable}`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="ZB8IJ7dy6wf4fKU10Sv9PPIkyo8YWmpkstTiBp_TBak"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${prompt.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}