"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { T } from "@/lib/metin";
import { zil } from "@/lib/ses";
import { titret } from "@/lib/haptik";

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
          {/* Otobüs durak isteği düğmesi: tutunma borusu, kelepçeler, açık kasa (menünün çizgi dili), DURACAK paneli, basılan sarı düğme */}
          <div className="relative h-[264px] w-[160px]">
            <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-ink" />
            <span aria-hidden="true" className="absolute left-1/2 top-[42px] h-[12px] w-[22px] -translate-x-1/2 rounded-[3px] border-2 border-ink bg-beyaz" />
            <span aria-hidden="true" className="absolute left-1/2 top-[214px] h-[12px] w-[22px] -translate-x-1/2 rounded-[3px] border-2 border-ink bg-beyaz" />
            <div className="absolute left-1/2 top-[56px] flex h-[156px] w-[112px] -translate-x-1/2 flex-col items-center gap-4 rounded-[20px] border-[3px] border-ink bg-beyaz px-3 pt-3">
              <motion.span
                aria-hidden="true"
                className="w-full rounded-md py-1 text-center text-[11px] font-bold tracking-[0.14em]"
                initial={false}
                animate={{ color: basildi ? "#FFD21F" : "#9C9890", backgroundColor: basildi ? "#161615" : "#ECEAE3" }}
                transition={{ duration: azalt ? 0 : 0.15 }}
              >
                DURACAK
              </motion.span>
              <span className="rounded-full bg-yuzey p-[5px]">
                <button
                  type="button"
                  onClick={bas}
                  aria-label={T.acilis.stopAria}
                  className="relative block size-[76px] rounded-full"
                >
                  <span aria-hidden="true" className="absolute inset-0 translate-y-[5px] rounded-full border-[3px] border-ink bg-[#C9A200]" />
                  <motion.span
                    className="relative grid size-full place-items-center rounded-full border-[3px] border-ink bg-sari text-[15px] font-bold tracking-[0.06em] text-ink"
                    initial={false}
                    animate={basildi && !azalt ? { y: [0, 5, 5, 0] } : { y: 0 }}
                    transition={{ duration: 0.38, times: [0, 0.2, 0.6, 1], ease: "easeOut" }}
                  >
                    {T.acilis.stop}
                  </motion.span>
                </button>
              </span>
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
