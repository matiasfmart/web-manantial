import CopyableValue from "./copyable-value";

type BankTransfer = {
  bank: string;
  holder: string;
  cbu: string;
  alias: string;
  cuit: string;
};

export default function BankTransferDetails({ details }: { details: BankTransfer }) {
  const mainRows = [
    { label: "Alias", value: details.alias, actionLabel: "Copiar alias", variant: "primary" as const },
    { label: "CBU", value: details.cbu, actionLabel: "Copiar CBU", variant: "secondary" as const },
  ];

  const supportRows = [
    { label: "Banco", value: details.bank },
    { label: "Titular", value: details.holder },
    { label: "CUIT", value: details.cuit },
  ];

  return (
    <div className="space-y-5 text-sm">
      <div className="space-y-3">
        {mainRows.map((row) => (
          <CopyableValue
            key={row.label}
            label={row.label}
            value={row.value}
            actionLabel={row.actionLabel}
            variant={row.variant}
          />
        ))}
      </div>

      <div className="divide-y divide-line border-y border-line text-xs sm:text-sm">
        {supportRows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 px-0 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-3">
            <span className="font-medium uppercase tracking-wide text-muted">{row.label}</span>
            <div className="min-w-0 sm:text-right">
              <span className="break-all text-right font-semibold text-carbon">
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
