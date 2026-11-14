// Son aramalar: localStorage, en çok 6, tekrarsız, en yeni üstte.
const ANAHTAR = "ns-son-arama";
const LIMIT = 6;

export function sonOku(): string[] {
  try {
    const d = JSON.parse(localStorage.getItem(ANAHTAR) ?? "[]") as unknown;
    return Array.isArray(d) ? d.filter((x): x is string => typeof x === "string").slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

function yaz(l: string[]) {
  try {
    if (l.length) localStorage.setItem(ANAHTAR, JSON.stringify(l));
    else localStorage.removeItem(ANAHTAR);
  } catch {
    /* yut */
  }
}

export function sonEkle(q: string): string[] {
  const t = q.trim();
  const eski = sonOku();
  if (t.length < 2) return eski;
  const yeni = [t, ...eski.filter((x) => x.toLocaleLowerCase("tr-TR") !== t.toLocaleLowerCase("tr-TR"))].slice(0, LIMIT);
  yaz(yeni);
  return yeni;
}

export function sonTemizle(): string[] {
  yaz([]);
  return [];
}
