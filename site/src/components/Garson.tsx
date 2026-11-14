"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { toplamAdet, toplamTutar, type Satir } from "@/lib/liste";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { titret } from "@/lib/haptik";

// Masa numarası URL'den (?masa=7); yoksa masa satırı gösterilmez
function masaOku(): string | null {
  try {
    const m = new URLSearchParams(window.location.search).get("masa")?.trim() ?? "";
    return /^[\p{L}\p{N}-]{1,6}$/u.test(m) ? m : null;
  } catch {
    return null;
  }
}

export function Garson({ liste, kapat }: { liste: readonly Satir[]; kapat: () => void }) {
  const azalt = useReducedMotion();
  const [masa] = useState(masaOku);
  const geri = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    titret(12);
    geri.current?.focus({ preventScroll: true });
    // Ekran uyanık kalsın (Wake Lock); desteklenmiyorsa ya da reddedilirse sessizce geç
    let kilit: WakeLockSentinel | null = null;
    let bitti = false;
    const al = () => {
      try {
        navigator.wakeLock
          ?.request("screen")
          .then((l) => {
            if (bitti) void l.release().catch(() => {});
            else kilit = l;
          })
          .catch(() => {});
      } catch {
        /* yut */
      }
    };
    const gorunur = () => {
      // Sekme gizlenince kilit düşer; geri gelince yeniden al
      if (document.visibilityState === "visible") al();
    };
    al();
    document.addEventListener("visibilitychange", gorunur);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && kapat();
    document.addEventListener("keydown", esc);
    return () => {
      bitti = true;
      document.removeEventListener("visibilitychange", gorunur);
      document.removeEventListener("keydown", esc);
      try {
        void kilit?.release().catch(() => {});
      } catch {
        /* yut */
      }
    };
  }, [kapat]);

  return (
    <motion.section
      role="dialog"
      aria-modal="true"
      aria-label={T.garson.aria}
      className="fixed inset-0 z-[90] flex flex-col bg-sari"
      initial={{ y: azalt ? 0 : "100%" }}
      animate={{ y: 0 }}
      exit={{ y: azalt ? 0 : "100%" }}
      transition={{ duration: azalt ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[480px] flex-1 flex-col">
        <div className="flex items-center gap-2 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-2">
          <button
            ref={geri}
            type="button"
            onClick={kapat}
            aria-label={T.garson.geri}
            className="grid size-11 place-items-center rounded-full border-[1.5px] border-ink"
          >
            <ChevronLeft size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <span className="flex-1" />
          <span className="text-[13px] font-medium">{T.garson.ekranAcik}</span>
        </div>

        <div className="grid flex-1 content-start gap-5 overflow-y-auto px-6 pt-2 pb-4">
          {masa && (
            <div className="flex items-center gap-3">
              <span className="grid size-16 place-items-center rounded-full bg-ink text-[26px] font-bold text-beyaz tabular-nums">
                {masa}
              </span>
              <div>
                <div className="font-medium">{T.garson.masa}</div>
                <div className="text-[22px] font-bold">{T.garson.urunSay(toplamAdet(liste))}</div>
              </div>
            </div>
          )}
          {!masa && <div className="text-[22px] font-bold">{T.garson.urunSay(toplamAdet(liste))}</div>}
          <ul className="grid gap-5">
            {liste.map((x) => (
              <li key={x.k} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <b className="block text-[30px] leading-[1.05] tracking-[-0.02em]">
                    {x.n} × {x.ad}
                  </b>
                  {(x.s || x.not) && (
                    <small className="text-base opacity-80">
                      {[x.s && T.secim.suruplu(x.s), x.not].filter(Boolean).join(" · ")}
                    </small>
                  )}
                </div>
                <span className="text-xl font-semibold whitespace-nowrap tabular-nums">{tl(x.f * x.n)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between border-t-2 border-ink pt-3.5 text-lg">
            <span>{T.garson.toplam}</span>
            <b className="text-[42px] tabular-nums">{tl(toplamTutar(liste))}</b>
          </div>
        </div>

        <div className="grid gap-2.5 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={kapat} className="min-h-12 rounded-full bg-ink px-4 text-base font-semibold text-beyaz">
            {T.garson.don}
          </button>
          <p className="text-center text-[13px] opacity-80">{T.garson.uyari}</p>
        </div>
      </div>
    </motion.section>
  );
}
