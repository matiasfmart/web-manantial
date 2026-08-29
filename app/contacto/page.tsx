import type { Metadata } from "next";
import { churchInfo } from "@/lib/data";
import ContactForm from "@/components/contact-form";
import { SocialBrandIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con Ministerio Manantial de Avivamiento en Villa Lugano, CABA. Escribinos o visitanos en nuestro auditorio.",
};

export default function ContactoPage() {
  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Estamos para vos</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          Hablemos
        </h1>
        <p className="mt-6 max-w-2xl text-white/60">
          Ya sea que quieras sumarte a un ministerio, a un GDI, o simplemente
          conocernos: escribinos y te vamos a responder a la brevedad.
        </p>
      </section>

      {/* FORMULARIO Y DATOS (fondo claro para mayor legibilidad) */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ContactForm variant="light" />

          <div className="space-y-8">
            <div className="border-y border-ink/10 py-6">
              <p className="eyebrow !text-brand">Auditorio</p>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
                {churchInfo.auditoriumName}
              </h2>
              <p className="mt-2 text-ink/60">{churchInfo.address}</p>
              <p className="mt-1 text-sm italic text-ink/40">
                {churchInfo.historicNote}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-ink/70 sm:grid-cols-2">
                <p>📞 {churchInfo.phone}</p>
                <p>✉️ {churchInfo.email}</p>
              </div>
            </div>

            <div className="border-y border-ink/10 py-6">
              <p className="eyebrow !text-brand">Pedí oración</p>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
                Estamos para orar por vos
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {churchInfo.prayerRequest.intro}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-ink/70 sm:grid-cols-2">
                <p>📱 {churchInfo.prayerRequest.mobile}</p>
                <p>☎️ {churchInfo.prayerRequest.landline}</p>
              </div>
              <a
                href={churchInfo.prayerRequest.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6"
              >
                <SocialBrandIcon platform="whatsapp" />
                Escribir por WhatsApp
              </a>
            </div>

            <div className="overflow-hidden border border-ink/10">
              <iframe
                title="Mapa del auditorio"
                className="h-72 w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  churchInfo.mapsQuery
                )}&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
