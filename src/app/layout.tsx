import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Oxanium } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Tracker } from "@/components/Tracker";
import { BagProvider } from "@/lib/bag";
import { FloatingShopAgent } from "@/components/FloatingShopAgent";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Puse AI",
  description:
    "Puse AI — skin analysis and apparel virtual try-on in one shop, powered by the YouCam API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} ${oxanium.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <BagProvider>
          <Tracker />
          <Nav />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
          <FloatingShopAgent />
        </BagProvider>
      </body>
    </html>
  );
}
