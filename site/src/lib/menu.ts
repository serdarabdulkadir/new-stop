import veri from "@/data/menu.json";

export type Urun = {
  id: string;
  ad: string;
  ar?: string;
  fiyat: number;
  not?: string;
  surup?: boolean;
  foto?: string;
};
export type Kategori = { id: string; ad: string; ikon: string; urunler: Urun[] };
/** Ürün + bağlı olduğu kategori (arama, vitrin, sayfa için) */
export type UrunKat = Urun & { katId: string; katAd: string };

export const KATEGORILER = veri as Kategori[];

export const TUM: UrunKat[] = KATEGORILER.flatMap((k) =>
  k.urunler.map((u) => ({ ...u, katId: k.id, katAd: k.ad })),
);

export const KAT_URUNLERI: Record<string, UrunKat[]> = Object.fromEntries(
  KATEGORILER.map((k) => [k.id, TUM.filter((u) => u.katId === k.id)]),
);

export const SURUPLAR = ["Karamel", "Fındık", "Vanilya", "Çilek"] as const;

// "Bugün durakta" vitrini: fotoğrafı olan ürünlerden seçilmiş sıra
const VITRIN_ID = [
  "frozen-karpuz-frozen",
  "kokteyl-blue-lagoon",
  "milkshake-cikolatali-milkshake",
  "bubble-tea-yaban-mersini",
  "soguk-kahve-ice-white-mocha",
  "espresso-latte",
  "turk-kahvesi-turk-kahvesi",
];
export const VITRIN: UrunKat[] = VITRIN_ID.map((id) => TUM.find((u) => u.id === id)).filter(
  (u): u is UrunKat => Boolean(u),
);

// Arama sonucu boşken önerilen kategoriler
export const ONERI_KATEGORI = ["espresso", "frozen", "tatli"];

export const katBul = (id: string) => KATEGORILER.find((k) => k.id === id);
