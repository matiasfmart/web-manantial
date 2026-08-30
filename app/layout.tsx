import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingPlayer from "@/components/floating-player";
import MotionProvider from "@/components/motion-provider";
import { RadioProvider } from "@/components/radio-context";
import { getChurchInfo, getMinistries } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";

const sansFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const churchInfo = await getChurchInfo();
  return {
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
        "En el corazón de Villa Lugano. Escuchá nuestra radio en vivo, y sumate a nuestras reuniones, también de forma online.",
      locale: "es_AR",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#101314",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [churchInfo, ministries] = await Promise.all([getChurchInfo(), getMinistries()]);
  const transmissionStatus = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : ({ kind: "unavailable" } as const);

  return (
    <html lang="es-AR" data-scroll-behavior="smooth" className={sansFont.variable}>
      <body className="font-body antialiased">
        <RadioProvider streamUrl={churchInfo.radioStreamUrl}>
          <MotionProvider />
          <Header churchInfo={churchInfo} transmissionStatus={transmissionStatus} />
          <main className="min-h-screen">{children}</main>
          <Footer churchInfo={churchInfo} ministries={ministries} />
          <FloatingPlayer churchInfo={churchInfo} />
        </RadioProvider>
      </body>
    </html>
  );
}
