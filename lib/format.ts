/** Inicial en mayúscula para avatares. */
export function initial(name: string | null | undefined): string {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

/** Fecha de hoy en yyyy-mm-dd (para guardar). */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** yyyy-mm-dd -> dd/mm (para mostrar en el historial). */
export function shortDate(iso: string): string {
  const parts = (iso || "").split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}`;
}
