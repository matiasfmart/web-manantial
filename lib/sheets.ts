/**
 * Lector de Google Sheets sin API key: usa el endpoint público "gviz" que
 * exporta una hoja como CSV. Requiere que el Sheet esté compartido como
 * "Cualquier persona con el enlace puede ver" y el ID en GOOGLE_SHEET_ID.
 * Si no hay ID configurado o falla la lectura, devuelve un array vacío para
 * que el sitio siga funcionando con los datos por defecto (ver lib/data.ts).
 */
export async function getSheetRows(tabName: string): Promise<Record<string, string>[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return [];

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tabName
  )}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error(`[sheets] La hoja "${tabName}" respondió ${res.status}`);
      return [];
    }
    return parseCsv(await res.text());
  } catch (err) {
    console.error(`[sheets] Error leyendo la hoja "${tabName}":`, err);
    return [];
  }
}

/** Convierte filas { key, value } (dos columnas) en un objeto plano. */
export function rowsToKeyValue(rows: Record<string, string>[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const row of rows) {
    if (row.key) out[row.key] = row.value ?? "";
  }
  return out;
}

function parseCsv(csv: string): Record<string, string>[] {
  const rows = parseCsvRows(csv);
  if (rows.length === 0) return [];

  const [header, ...body] = rows;
  return body
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => Object.fromEntries(header.map((key, i) => [key.trim(), (row[i] ?? "").trim()])));
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
