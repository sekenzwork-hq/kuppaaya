import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const inter = Inter({
subsets: ["latin"],
variable: "--font-inter",
display: "swap",
});

const playfair = Playfair_Display({
subsets: ["latin"],
variable: "--font-playfair",
display: "swap",
});

export const metadata: Metadata = {
metadataBase: new URL("https://kuppaaya.online"),

title: {
default: "Kuppaaya | Premium Women's Fashion",
template: "%s | Kuppaaya",
},

description:
"Discover premium women's fashion at Kuppaaya. Explore elegant dresses, ethnic wear, casual collections, and contemporary styles designed for confidence, comfort, and everyday elegance.",

keywords: [
  "Kuppaaya",
  "women fashion",
  "women clothing",
  "fashion boutique",
  "online clothing store",
  "ethnic wear",
  "casual wear",
  "women dresses",
  "kerala fashion",
  "indian fashion",
  "womens apparel",
  "fashion brand",
  "kuppaaya online",
],

authors: [{ name: "Kuppaaya" }],
creator: "Kuppaaya",
publisher: "Kuppaaya",

robots: {
index: true,
follow: true,
},

icons: {
icon: "/images/logo.png",
shortcut: "/images/logo.png",
apple: "/images/logo.png",
},

openGraph: {
type: "website",
locale: "en_US",
url: "https://kuppaaya.online",
siteName: "Kuppaaya",
title: "Kuppaaya | Premium Women's Fashion",
description:
"Premium women's fashion designed for confidence, comfort, and timeless elegance.",
images: [
{
url: "/images/logo.png",
width: 1200,
height: 630,
alt: "Kuppaaya",
},
],
},

twitter: {
card: "summary_large_image",
title: "Kuppaaya | Premium Women's Fashion",
description:
"Premium women's fashion designed for confidence, comfort, and timeless elegance.",
images: ["/images/logo.png"],
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
