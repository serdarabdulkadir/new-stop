"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { ONERILER } from "@/lib/oneriler";
import { katBul, type UrunKat } from "@/lib/menu";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { titret } from "@/lib/haptik";
import { KategoriIkon } from "./KategoriIkon";

export function RuhHali({ onAc, onEkle }: { onAc: (u: UrunKat) => void; onEkle: (u: UrunKat, k: DOMRect | null) => void }) {
  const azalt = useReducedMotion();
  const [id, setId] = useState(ONERILER[0].id);
  const o = ONERILER.find((x) => x.id === id) ?? ONERILER[0];

  return (
    <section aria-label={T.oneri.baslik} className="mt-5">
      <h2 className="px-4 pb-1 text-xl font-semibold">{T.oneri.baslik}</h2>
      <div role="tablist" aria-label={T.oneri.sekmeAria} className="serit flex gap-5 overflow-x-auto px-4">
        {ONERILER.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`rh-${x.id}`}
            aria-selected={x.id === id}
            aria-controls="rh-panel"
            onClick={() => {
              if (x.id !== id) titret(5);
              setId(x.id);
            }}
            className={`min-h-11 flex-none border-b-2 text-[17px] font-medium whitespace-nowrap transition-colors duration-150 ${
              x.id === id ? "border-ink text-ink" : "border-transparent text-soluk"
            }`}
          >
            {x.ad}
          </button>
        ))}
      </div>
      <p className="px-4 pt-2 text-[13px] text-soluk">{o.aciklama}</p>
      <div id="rh-panel" role="tabpanel" aria-labelledby={`rh-${id}`} className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={id}
            className="serit flex gap-3 overflow-x-auto px-4 pt-3 pb-1"
            initial={azalt ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={azalt ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: azalt ? 0 : 0.16 }}
          >
            {o.urunler.map((u) => (
              <li
                key={u.id}
                className="group relative flex w-[230px] flex-none items-center gap-2.5 rounded-2xl bg-yuzey p-2.5 shadow-xs transition-transform active:scale-[0.99]"
              >
                {u.foto ? (
                  <Image
                    src={u.foto}
                    alt={u.ad}
                    width={60}
                    height={60}
                    className="size-[60px] flex-none rounded-xl object-cover bg-zemin"
                  />
                ) : (
                  <div className="grid size-[60px] flex-none place-items-center rounded-xl bg-zemin text-soluk">
                    <KategoriIkon ad={katBul(u.katId)?.ikon ?? ""} boyut={22} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onAc(u)}
                  aria-label={T.menu.ayrintiAria(u.ad)}
                  className="min-w-0 flex-1 text-start"
                >
                  <span className="block truncate text-sm font-semibold leading-snug text-ink">
                    {u.ad}
                  </span>
                  <span className="mt-1 block text-[13px] font-medium text-soluk tabular-nums">
                    {tl(u.fiyat)}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={T.menu.ekleAria(u.ad)}
                  onClick={(e) =>
                    u.surup
                      ? onAc(u)
                      : onEkle(u, e.currentTarget.getBoundingClientRect())
                  }
                  className="grid size-9 flex-none place-items-center rounded-full bg-ink text-beyaz shadow-xs transition-transform active:scale-90"
                >
                  <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
