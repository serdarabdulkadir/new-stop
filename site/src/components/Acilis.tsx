"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { T } from "@/lib/metin";
import { zil } from "@/lib/ses";
import { titret } from "@/lib/haptik";

// Işınlar (STOP kutusunun iki yanı): yan, kenardan uzaklık, üst, açı
const ISIN: Array<{ yan: "left" | "right"; kenar: number; ust: number; aci: number }> = [
  { yan: "left", kenar: 20, ust: 92, aci: -34 },
  { yan: "left", kenar: 12, ust: 118, aci: 0 },
  { yan: "left", kenar: 20, ust: 146, aci: 34 },
  { yan: "right", kenar: 20, ust: 92, aci: 34 },
  { yan: "right", kenar: 12, ust: 118, aci: 0 },
  { yan: "right", kenar: 20, ust: 146, aci: -34 },
];

export function Acilis({ onGec }: { onGec: () => void }) {
  const azalt = useReducedMotion();
  const [basildi, setBasildi] = useState(false);
  const kilit = useRef(false);

  const bas = () => {
    if (kilit.current) return;
    kilit.current = true;
    setBasildi(true);
    zil();
    titret(18);
    window.setTimeout(onGec, azalt ? 0 : 900);
  };

  return (
    <motion.section
      aria-label={T.acilis.baslik}
      className="fixed inset-0 z-[60] flex flex-col bg-zemin"
      initial={false}
      exit={{ y: "-100%" }}
      transition={{ duration: azalt ? 0 : 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col">
        <div className="px-4 py-3.5 text-[13px] tracking-[0.28em]">{T.marka}</div>
        <div className="grid flex-1 content-center justify-items-center gap-5 text-center">
          <h1 className="text-[46px] leading-none font-bold tracking-[-0.03em]">{T.acilis.baslik}</h1>
          <div className="relative grid h-[240px] w-[200px] place-items-center">
            <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-ink" aria-hidden="true" />
            {ISIN.map(({ yan, kenar, ust, aci }, i) => (
              <motion.b
                key={i}
                aria-hidden="true"
                className="absolute h-[3px] w-5 rounded-sm bg-ink"
                style={{ [yan]: kenar, top: ust, rotate: aci }}
                initial={{ opacity: 0 }}
                animate={{ opacity: basildi ? 0.9 : 0 }}
                transition={{ duration: azalt ? 0 : 0.2, delay: azalt ? 0 : (i % 3) * 0.06 }}
              />
            ))}
            <div className="relative grid h-[128px] w-[100px] justify-items-center gap-3 rounded-[14px] border-[3px] border-ink bg-beyaz pt-4">
              <motion.button
                type="button"
                onClick={bas}
                aria-label={T.acilis.stopAria}
                className="relative size-[68px] rounded-full border-[3px] border-ink bg-sari text-sm font-bold tracking-[0.04em]"
                animate={basildi && !azalt ? { scale: [1, 0.9, 1], y: [0, 2, 0] } : undefined}
                transition={{ duration: 0.25 }}
              >
                {T.acilis.stop}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[3px] rounded-full border-[3px] border-sari"
                  initial={{ opacity: 0 }}
                  animate={basildi && !azalt ? { opacity: [1, 0], scale: [1, 2.5] } : { opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </motion.button>
              <i className="block h-0.5 w-[52px] rounded-sm bg-ink/45" />
              <i className="block h-0.5 w-[34px] translate-x-[-9px] rounded-sm bg-ink/45" />
            </div>
          </div>
          <div className="grid gap-1">
            <strong className="font-medium">{T.acilis.aciklama}</strong>
            <span className="text-sm text-soluk">{T.acilis.saat}</span>
          </div>
        </div>
        <div className="flex justify-center px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onGec}
            className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold underline underline-offset-4"
          >
            {T.acilis.gec}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
