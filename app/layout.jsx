import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import PWAProvider from "@/components/PWAProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecart.ebsystore.com";
const siteTitle = "EbsyStore - Latest gadgets at prices you trust";
const siteDescription =
    "Shop the latest smartphones, headphones, smartwatches and accessories in Pakistan. Pay with Cash on Delivery, JazzCash, Easypaisa, card or bank transfer.";

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteTitle,
        template: "%s | EbsyStore",
    },
    description: siteDescription,
    applicationName: "EbsyStore",
    openGraph: {
        type: "website",
        siteName: "EbsyStore",
        title: siteTitle,
        description: siteDescription,
        url: siteUrl,
        locale: "en_PK",
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
    },
};

export const viewport = { themeColor: "#16a34a" };

const themeScript = `
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={`${outfit.className} antialiased`}>
                <ClerkProvider>
                    <StoreProvider>
                        <Toaster />
                        <PWAProvider />
                        {children}
                    </StoreProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}