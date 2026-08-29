import type { Metadata } from "next";
import { churchInfo, givingInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ofrendas",
  description:
    "Ofrendá o diezmá online a Ministerio Manantial de Avivamiento por Mercado Pago, transferencia bancaria o QR.",
};

export default function OfrendasPage() {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&color=05070c&bgcolor=ffffff&data=${encodeURIComponent(
    givingInfo.mercadoPago.link
  )}`;

  return (
    <section className="section py-28">
      <p className="eyebrow">Sembrar es un acto de fe</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Ofrendá online
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">{givingInfo.intro}</p>
      <p className="mt-4 max-w-2xl text-sm italic text-brand-light">
        {givingInfo.verse}
      </p>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* QR */}
        <div className="card flex flex-col items-center p-8 text-center">
          <p className="eyebrow">Escaneá y ofrendá</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="Código QR para ofrendar por Mercado Pago"
              width={220}
              height={220}
              className="h-[220px] w-[220px]"
            />
          </div>
          <p className="mt-5 text-sm text-white/50">{givingInfo.qrNote}</p>
        </div>

        {/* Mercado Pago */}
        <div className="card flex flex-col p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark text-white shadow-glow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <rect x="2" y="5" width="20" height="14" rx="2.5" />
              <path d="M2 10h20M6 15h4" />
            </svg>
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold uppercase tracking-normal">
            Mercado Pago
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
            La forma más rápida de ofrendar desde tu celular, en cuotas o con
            saldo en cuenta.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-surface2 px-4 py-3 text-sm">
            <p className="text-white/40">Alias</p>
            <p className="font-semibold">{givingInfo.mercadoPago.alias}</p>
          </div>
          <a
            href={givingInfo.mercadoPago.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            Ofrendar con Mercado Pago
          </a>
        </div>

        {/* Transferencia bancaria */}
        <div className="card flex flex-col p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-glow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M3 10l9-6 9 6M5 10v9m14-9v9M9 19v-6h6v6M3 19h18" />
            </svg>
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold uppercase tracking-normal">
            Transferencia bancaria
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Ideal para diezmos y ofrendas desde tu banco o billetera virtual.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <Row label="Banco" value={givingInfo.bankTransfer.bank} />
            <Row label="Titular" value={givingInfo.bankTransfer.holder} />
            <Row label="CBU" value={givingInfo.bankTransfer.cbu} />
            <Row label="Alias" value={givingInfo.bankTransfer.alias} />
            <Row label="CUIT" value={givingInfo.bankTransfer.cuit} />
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="mt-16">
        <p className="eyebrow">¿A dónde va tu ofrenda?</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {givingInfo.categories.map((c) => (
            <div key={c.name} className="card p-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-normal text-brand-light">
                {c.name}
              </h3>
              <p className="mt-2 text-sm text-white/60">{c.description}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-14 text-sm text-white/40">
        ¿Tenés dudas sobre tu ofrenda o necesitás un comprobante? Escribinos a{" "}
        <a href={`mailto:${churchInfo.email}`} className="text-brand-light underline underline-offset-4">
          {churchInfo.email}
        </a>
        .
      </p>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface2 px-4 py-3">
      <span className="text-white/40">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
