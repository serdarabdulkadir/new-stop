"use client";
import {
  Bean, Blend, Cake, Citrus, Coffee, CupSoda, Flame, GlassWater, IceCreamBowl, IceCreamCone,
  Leaf, Martini, Milk, Pizza, Sandwich, Snowflake, Wind, type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const IKONLAR: Record<string, LucideIcon> = {
  Bean, Blend, Cake, Citrus, Coffee, CupSoda, Flame, GlassWater, IceCreamBowl, IceCreamCone,
  Leaf, Martini, Milk, Pizza, Sandwich, Snowflake, Wind,
};

type Props = { ad: string; boyut?: number; hareketli?: boolean; className?: string };

// Kahve ikonu: Lucide "coffee" path verisi (lucide-react v1.66.0, ISC lisansı) buraya alındı;
// yalnız duman çizgileri (M6 2v2, M10 2v2, M14 2v2) motion ile yavaşça yukarı çıkıp solar.
// Başka hiçbir ikon elle çizilmedi.
const DUMAN = ["M6 2v2", "M10 2v2", "M14 2v2"];
const GOVDE =
  "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1";

function KahveIkon({ boyut, hareketli, className }: { boyut: number; hareketli: boolean; className?: string }) {
  const azalt = useReducedMotion();
  const oynat = hareketli && !azalt;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={boyut}
      height={boyut}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={GOVDE} />
      {DUMAN.map((d, i) =>
        oynat ? (
          <motion.path
            key={d}
            d={d}
            initial={{ opacity: 0, y: 1.2 }}
            animate={{ opacity: [0, 0.9, 0], y: [1.2, -1.4, -2.2] }}
            transition={{ duration: 3.2, delay: i * 0.55, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 1] }}
          />
        ) : (
          <path key={d} d={d} />
        ),
      )}
    </svg>
  );
}

export function KategoriIkon({ ad, boyut = 20, hareketli = false, className }: Props) {
  if (ad === "Coffee") return <KahveIkon boyut={boyut} hareketli={hareketli} className={className} />;
  const Ikon = IKONLAR[ad] ?? CupSoda;
  return <Ikon size={boyut} strokeWidth={1.75} aria-hidden="true" className={className} />;
}
