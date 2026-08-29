import type { Metadata } from "next";
import Link from "next/link";
import { churchInfo, generalServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reuniones y horarios",
  description:
    "Conocé todos los horarios de reunión de la iglesia: cultos generales, GDI, jóvenes, adolescentes y escuela bíblica.",
};

const days = ["Martes", "Miércoles", "Sábados", "Domingos"];

export default function ReunionesPage() {
  return (
    <section className="section py-28">
      <p className="eyebrow">Reuniones públicas</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Sumate a nuestras reuniones
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">
        Todas nuestras reuniones generales se realizan en el{" "}
        {churchInfo.auditoriumName}, {churchInfo.address}. Los Grupos de
        Integración (GDI) también forman parte de nuestras reuniones
        generales, pero se organizan en distintos hogares — conocé más en la
        sección de{" "}
        <Link href="/ministerios/gdi" className="text-brand-light underline underline-offset-4">
          GDI
        </Link>
        .
      </p>

      <div className="mt-14 overflow-hidden rounded-2xl border border-white/10">
        {days.map((day) => {
          const items = generalServices.filter((s) => s.day === day);
          return (
            <div
              key={day}
              className="grid grid-cols-1 border-b border-white/10 last:border-0 sm:grid-cols-[180px_1fr]"
            >
              <div className="flex items-center bg-surface2 px-6 py-5 font-display text-2xl font-bold uppercase tracking-normal">
                {day}
              </div>
              <div className="divide-y divide-white/10">
                {items.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-2 px-6 py-5"
                  >
                    <span className="flex items-center gap-2 font-medium text-white/80">
                      {s.label}
                      {s.streamed && (
                        <Link
                          href="/en-vivo"
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-light"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          Se transmite por YouTube
                        </Link>
                      )}
                    </span>
                    <span className="font-display text-xl text-brand-light">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/primera-vez" className="group">
          <InfoCard
            title="¿Es tu primera vez? →"
            text="Vení tal cual estás. Contamos todo lo que necesitás saber antes de tu primera visita."
          />
        </Link>
        <InfoCard
          title="Niños y adolescentes"
          text="Durante las reuniones generales, los más chicos tienen su propio espacio en la Escuela Bíblica."
        />
        <InfoCard
          title="Grupos GDI"
          text="Se reúnen los miércoles 19:30 h en distintos hogares, organizados por edad y sexo. Contactanos para sumarte a uno cerca tuyo."
        />
      </div>
    </section>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-xl font-bold uppercase tracking-normal">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
    </div>
  );
}
