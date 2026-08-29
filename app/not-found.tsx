import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-6xl font-black uppercase tracking-normal">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-md text-ink/65">
        Parece que este camino no existe. Volvé al inicio o escuchá nuestra
        radio mientras tanto.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-primary">
          Ir al inicio
        </Link>
        <Link href="/radio" className="btn-secondary">
          Escuchar radio
        </Link>
      </div>
    </section>
  );
}
