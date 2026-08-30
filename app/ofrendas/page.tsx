import type { Metadata } from "next";
import { getChurchInfo, getGivingInfo } from "@/lib/data";
import BankTransferDetails from "@/components/bank-transfer-details";
import { ExternalButtonLink } from "@/components/ui/button";
import { ExternalInteractiveLink } from "@/components/ui/interactive-link";

export const metadata: Metadata = {
  title: "Ofrendas",
  description:
    "Ofrendá o diezmá online a Ministerio Manantial de Avivamiento por Mercado Pago, transferencia bancaria o QR.",
};

export default async function OfrendasPage() {
  const [churchInfo, givingInfo] = await Promise.all([getChurchInfo(), getGivingInfo()]);

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

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <div className="max-w-2xl">
            <p className="eyebrow">Métodos disponibles</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
              Elegí cómo querés ofrendar
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-copy">
              Elegí la opción que te resulte más cómoda. Ambos medios se procesan de forma segura.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12" data-stagger>
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
                    Ofrendá desde tu celular con saldo, tarjeta o cuenta vinculada.
                  </p>
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
                    Usá estos datos desde tu banco o billetera virtual.
                  </p>
                  <div className="mt-6">
                    <BankTransferDetails details={givingInfo.bankTransfer} />
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
