import Fuse from "fuse.js";
import { KATEGORILER, TUM, type Kategori, type UrunKat } from "./menu";

const HARF: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", "’": "'", "‘": "'" };

/** Tek karakteri Türkçe duyarsız biçime çevirir (uzunluk korunur). */
export function sadeHarf(c: string): string {
  const l = c.toLocaleLowerCase("tr-TR");
  if (/[̀-ͯ]/.test(l)) return "";
  const m = HARF[l] ?? l;
  return m.length === 1 ? m : m[0];
}

/** Türkçe karakter duyarsız karşılaştırma için sadeleştirir. */
export function sade(s: string): string {
  return Array.from(s).map(sadeHarf).join("").replace(/\s+/g, " ").trim();
}

// Hızlı süzgeçler: sıcak/soğuk/tatlı kategori id'sinden türetilir (tek eşleme tablosu).
// Nargile hiçbirine girmez.
export const SICAK_KAT = ["espresso", "turk-kahvesi", "sicak", "bitki-caylari"];
const SOGUK_KAT = [
  "soguk-kahve", "soguk-icecek", "milkshake", "frozen", "bubble-tea", "frappe",
  "sikma-meyveler", "kokteyl", "dondurma",
];
const TATLI_KAT = ["tatli", "dondurma"];

export type Suzgec = "sicak" | "soguk" | "ucuz" | "tatli";
export const SUZGECLER: Suzgec[] = ["sicak", "soguk", "ucuz", "tatli"];
const TUR_KAT: Record<"sicak" | "soguk" | "tatli", string[]> = {
  sicak: SICAK_KAT,
  soguk: SOGUK_KAT,
  tatli: TATLI_KAT,
};
export const UCUZ_LIMIT = 200;

/** Tür süzgeçleri (sıcak/soğuk/tatlı) birbiriyle VEYA, fiyat süzgeciyle VE çalışır. */
export function suzgecUygun(u: UrunKat, f: Suzgec[]): boolean {
  const turler = f.filter((x): x is "sicak" | "soguk" | "tatli" => x !== "ucuz");
  if (turler.length && !turler.some((t) => TUR_KAT[t].includes(u.katId))) return false;
  if (f.includes("ucuz") && u.fiyat > UCUZ_LIMIT) return false;
  return true;
}

type Kayit = { u: UrunKat; ad: string; kat: string; not: string; ar: string };
const kayitlar: Kayit[] = TUM.map((u) => ({
  u,
  ad: sade(u.ad),
  kat: sade(u.katAd),
  not: sade(u.not ?? ""),
  ar: sade(u.ar ?? ""),
}));

let fuse: Fuse<Kayit> | null = null;
const SINIR = 40;

/** Önce "içerir" eşleşmeleri, sonra bulanık eşleşmeler. Süzgeç tek başına da çalışır. */
export function ara(sorgu: string, suzgec: Suzgec[] = []): UrunKat[] {
  const q = sade(sorgu);
  if (!q) return kayitlar.filter((k) => suzgecUygun(k.u, suzgec)).map((k) => k.u);

  fuse ??= new Fuse(kayitlar, {
    keys: [
      { name: "ad", weight: 3 },
      { name: "not", weight: 1 },
      { name: "ar", weight: 1 },
      { name: "kat", weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
  });

  const sira = new Map<string, { u: UrunKat; rank: number; idx: number }>();
  kayitlar.forEach((k, idx) => {
    let rank = Infinity;
    if (k.ad.startsWith(q) || k.ad.split(" ").some((w) => w.startsWith(q))) rank = 0;
    else if (k.ad.includes(q)) rank = 1;
    else if (k.kat.includes(q) || k.ar.includes(q)) rank = 1.5;
    if (rank < Infinity) sira.set(k.u.id, { u: k.u, rank, idx });
  });
  if (q.length >= 2) {
    for (const r of fuse.search(q)) {
      if (!sira.has(r.item.u.id)) {
        sira.set(r.item.u.id, {
          u: r.item.u,
          rank: 2 + (r.score ?? 1),
          idx: kayitlar.indexOf(r.item),
        });
      }
    }
  }
  return [...sira.values()]
    .filter((x) => suzgecUygun(x.u, suzgec))
    .sort((a, b) => a.rank - b.rank || a.idx - b.idx)
    .slice(0, SINIR)
    .map((x) => x.u);
}

/** Adı sorguyu içeren kategoriler ("Kategoriye git" satırı için). */
export function kategoriEsles(sorgu: string): Kategori[] {
  const q = sade(sorgu);
  if (q.length < 2) return [];
  return KATEGORILER.filter((k) => sade(k.ad).includes(q));
}

/** Eşleşen kısımları kalın göstermek için karakter işaretleri. */
export function vurguMaskesi(ad: string, sorgu: string): boolean[] {
  const harfler = Array.from(ad);
  const maske = harfler.map(() => false);
  const s = harfler.map(sadeHarf);
  if (s.some((x) => x.length !== 1)) return maske;
  const duz = s.join("");
  for (const t of sade(sorgu).split(" ")) {
    if (!t) continue;
    const i = duz.indexOf(t);
    if (i >= 0) for (let j = i; j < i + t.length; j++) maske[j] = true;
  }
  return maske;
}
