// "Bugün ne lazım?" önerileri: sekme tanımları + kural fonksiyonu.
import { KATEGORILER, TUM, type UrunKat } from "./menu";
import { SICAK_KAT, sade } from "./arama";
import { T } from "./metin";

export type Oneri = { id: keyof typeof T.oneri.sekme; ad: string; aciklama: string; urunler: UrunKat[] };

type Tanim = {
  id: Oneri["id"];
  adlar?: string[]; // menu.json'daki ürün adları (Türkçe duyarsız eşleşir)
  kategoriler?: string[]; // kategori id'leri (tüm ürünler)
  kural?: (tum: UrunKat[]) => UrunKat[];
};

const TANIMLAR: Tanim[] = [
  { id: "uyan", adlar: ["Double Espresso", "Americano", "Türk Kahvesi", "Double Türk Kahvesi", "Filtre Kahve", "Cortado"] },
  { id: "serinle", adlar: ["Ice Americano", "Ice Latte", "Karpuz Frozen", "Limonata", "Cool Lime", "Blue Lagoon"] },
  {
    id: "tatli",
    adlar: ["White Mocha", "Çikolatalı Milkshake", "Sıcak Çikolata", "Limonlu Cheesecake", "N'Snickers", "Frappe"],
  },
  { id: "doy", kategoriler: ["tost", "pizza"] },
  {
    id: "ders",
    // Sıcak kategorilerden fiyatı 150 ₺ ve altı olanlar, ucuzdan pahalıya, en çok 6
    kural: (tum) =>
      tum
        .filter((u) => SICAK_KAT.includes(u.katId) && u.fiyat <= 150)
        .sort((a, b) => a.fiyat - b.fiyat)
        .slice(0, 6),
  },
];

/** menu.json'da bulunamayıp sessizce atlanan öneri adları */
export const EKSIK_ONERI_ADLARI: string[] = [];

function coz(t: Tanim): UrunKat[] {
  if (t.kural) return t.kural(TUM);
  if (t.kategoriler) {
    return t.kategoriler.flatMap((id) => (KATEGORILER.some((k) => k.id === id) ? TUM.filter((u) => u.katId === id) : []));
  }
  return (t.adlar ?? []).flatMap((ad) => {
    const u = TUM.find((x) => sade(x.ad) === sade(ad));
    if (!u) EKSIK_ONERI_ADLARI.push(ad);
    return u ? [u] : [];
  });
}

export const ONERILER: Oneri[] = TANIMLAR.map((t) => ({
  id: t.id,
  ad: T.oneri.sekme[t.id].ad,
  aciklama: T.oneri.sekme[t.id].aciklama,
  urunler: coz(t),
}));
