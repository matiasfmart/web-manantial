import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingPlayer from "@/components/floating-player";
import { RadioProvider } from "@/components/radio-context";
import { churchInfo } from "@/lib/data";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iglesiamanantial.org"),
  title: {
    default: `${churchInfo.name} — Auditorio en Villa Lugano, CABA`,
    template: `%s · ${churchInfo.name}`,
  },
  description:
    "Iglesia cristiana evangélica en Villa Lugano, Buenos Aires. Reuniones, ministerios y Radio Maranata en vivo, las 24 horas.",
  openGraph: {
    title: churchInfo.name,
    description:
      "Una iglesia moderna en el corazón de Villa Lugano. Escuchá nuestra radio en vivo y sumate a nuestras reuniones.",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-body antialiased">
        <RadioProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingPlayer />
        </RadioProvider>
      </body>
    </html>
  );
}
