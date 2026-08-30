"use client";

import { useId, useState } from "react";

type Item = {
  title: string;
  text: string;
};

export default function FirstVisitAccordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-8 divide-y divide-line border-y border-line">
      {items.map((item, index) => (
        <AccordionItem
          key={item.title}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: Item;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = useId();

  return (
    <div className="group py-5 sm:px-3">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left font-display text-lg font-semibold text-ink transition hover:text-brand"
      >
        <span>{item.title}</span>
        <span
          aria-hidden="true"
          className={`grid h-7 w-7 shrink-0 place-items-center border border-line text-lg font-normal text-muted transition duration-300 ${
            isOpen ? "rotate-45 border-ink/30 text-ink" : "group-hover:border-brand/40 group-hover:text-brand"
          }`}
        >
          +
        </span>
      </button>
      <div
        id={contentId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3">
          <p className="max-w-3xl text-sm leading-relaxed text-copy">{item.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
