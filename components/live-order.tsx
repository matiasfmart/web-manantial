"use client";

import { Fragment, type ReactNode } from "react";
import { useLiveService } from "./use-live-service";

/**
 * Reordena radio/culto según si el culto de YouTube está en su ventana de
 * transmisión en vivo: el que está "al aire" en ese momento va primero.
 */
export default function LiveOrder({
  radio,
  culto,
}: {
  radio: ReactNode;
  culto: ReactNode;
}) {
  const isLive = useLiveService();
  const items = isLive
    ? [
        { key: "culto", node: culto },
        { key: "radio", node: radio },
      ]
    : [
        { key: "radio", node: radio },
        { key: "culto", node: culto },
      ];

  return (
    <>
      {items.map(({ key, node }) => (
        <Fragment key={key}>{node}</Fragment>
      ))}
    </>
  );
}

