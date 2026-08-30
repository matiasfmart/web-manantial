import type { Metadata } from "next";
import { getChurchInfo, getGivingInfo } from "@/lib/data";
import { ExternalButtonLink } from "@/components/ui/button";
import { ExternalInteractiveLink } from "@/components/ui/interactive-link";

export const metadata: Metadata = {
  title: "Ofrendas",
  description:
    "Ofrendá o diezmá online a Ministerio Manantial de Avivamiento por Mercado Pago, transferencia bancaria o QR.",
};

export default async function OfrendasPage() {
  const [churchInfo, givingInfo] = await Promise.all([getChurchInfo(), getGivingInfo()]);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&color=05070c&bgcolor=ffffff&data=${encodeURIComponent(
    givingInfo.mercadoPago.link
  )}`;

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Sembrar es un acto de fe</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          Ofrendá online
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">{givingInfo.intro}</p>
        <p className="mt-4 max-w-2xl text-sm italic text-ink/50">
          {givingInfo.verse}
        </p>
      </section>

      {/* METODOS DE PAGO (fondo claro: más confianza y legibilidad) */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]">
          <aside className="border-y border-ink/10 py-6 lg:sticky lg:top-24 lg:h-fit" data-reveal>
            <p className="eyebrow">QR</p>
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
              Escaneá y ofrendá
            </h2>
            <div className="mt-6 w-fit border border-ink/10 p-3 transition hover:-translate-y-1 hover:border-brand/35">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="Código QR para ofrendar por Mercado Pago"
                width={220}
                height={220}
                className="h-[220px] w-[220px]"
              />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/50">
              {givingInfo.qrNote}
            </p>
          </aside>

          <div className="space-y-10" data-stagger>
            <section className="border-t border-ink/10 pt-6">
              <div className="grid grid-cols-[44px_1fr] gap-4">
                <div className="flex h-11 w-11 items-center justify-center bg-ink text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <rect x="2" y="5" width="20" height="14" rx="2.5" />
                    <path d="M2 10h20M6 15h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-normal">
                    Mercado Pago
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
                    La forma más rápida de ofrendar desde tu celular, en cuotas o
                    con saldo en cuenta.
                  </p>
                  <div className="mt-6 border-y border-ink/10 py-4 text-sm">
                    <Row label="Alias" value={givingInfo.mercadoPago.alias} />
                  </div>
                  <ExternalButtonLink
                    href={givingInfo.mercadoPago.link}
                    className="mt-6"
                  >
                    Ofrendar con Mercado Pago
                  </ExternalButtonLink>
                </div>
              </div>
            </section>

            <section className="border-t border-ink/10 pt-6">
              <div className="grid grid-cols-[44px_1fr] gap-4">
                <div className="flex h-11 w-11 items-center justify-center bg-carbon text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M3 10l9-6 9 6M5 10v9m14-9v9M9 19v-6h6v6M3 19h18" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-normal">
                    Transferencia bancaria
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
                    Ideal para diezmos y ofrendas desde tu banco o billetera virtual.
                  </p>
                  <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                    <Row label="Banco" value={givingInfo.bankTransfer.bank} />
                    <Row label="Titular" value={givingInfo.bankTransfer.holder} />
                    <Row label="CBU" value={givingInfo.bankTransfer.cbu} />
                    <Row label="Alias" value={givingInfo.bankTransfer.alias} />
                    <Row label="CUIT" value={givingInfo.bankTransfer.cuit} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        {/* Categorías */}
        <div>
          <p className="eyebrow">¿A dónde va tu ofrenda?</p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {givingInfo.categories.map((c) => (
              <div key={c.name} className="border-t border-ink/10 pt-5">
                <h3 className="font-display text-lg font-semibold tracking-normal text-ink">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm text-ink/65">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-14 text-sm text-ink/50">
          ¿Tenés dudas sobre tu ofrenda o necesitás un comprobante? Escribinos a{" "}
          <ExternalInteractiveLink href={`mailto:${churchInfo.email}`} className="text-brand">
            {churchInfo.email}
          </ExternalInteractiveLink>
          .
        </p>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 transition-colors hover:bg-mist/60 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-ink/40">{label}</span>
      <span className="break-all font-semibold text-ink/85 sm:text-right">{value}</span>
    </div>
  );
}
