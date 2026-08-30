"use client";

import { useState } from "react";

const categories = [
  { id: "life-stage", label: "Por etapa" },
  { id: "formation", label: "Formación" },
  { id: "community", label: "Comunidad" },
  { id: "serve", label: "Servir" },
];

export default function MinistryCategoryNav() {
  const [active, setActive] = useState<string | null>(null);

  const goToCategory = (id: string) => {
    setActive(id);
    document.getElementById(`ministerios-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" aria-label="Explorar ministerios por tipo">
      <div className="flex w-max gap-2 pb-2 sm:w-auto sm:flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => goToCategory(category.id)}
            className={`relative border px-4 py-2 text-sm font-medium transition duration-300 after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-[620ms] after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-ink/55 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-0 active:scale-[0.98] ${
              active === category.id ? "border-ink text-ink after:scale-x-100" : "border-ink/20 text-ink/70"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
