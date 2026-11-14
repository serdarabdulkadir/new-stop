"use client";
import { Minus, Plus } from "lucide-react";
import { adetDegistir, listeyiTemizle, toplamTutar, type Satir } from "@/lib/liste";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { titret } from "@/lib/haptik";
import { SayfaKabi } from "./Sayfa";

export function Secimler({
  acik,
  kapat,
  liste,
  onGoster,
}: {
  acik: boolean;
  kapat: () => void;
  liste: readonly Satir[];
  onGoster: () => void;
}) {
  const degis = (k: string, d: number) => {
    adetDegistir(k, d);
    titret(4);
  };
  return (
    <SayfaKabi acik={acik} kapat={kapat} baslik={T.secim.baslik}>
      <div className="grid gap-1 overflow-y-auto overscroll-contain px-4 pt-1.5 pb-4">
        <h3 aria-hidden="true" className="pb-1 text-[30px] leading-tight font-bold tracking-[-0.02em]">
          {T.secim.baslik}
        </h3>
        {liste.length === 0 ? (
          <p className="py-8 text-center text-soluk">{T.secim.bos}</p>
        ) : (
          <>
            <ul>
              {liste.map((x) => (
                <li key={x.k} className="flex items-center gap-3 border-b border-cizgi py-3">
                  <div className="min-w-0 flex-1">
                    <strong className="font-semibold">{x.ad}</strong>
                    {(x.s || x.not) && (
                      <small className="block text-[13px] text-soluk">
                        {[x.s && T.secim.suruplu(x.s), x.not].filter(Boolean).join(" · ")}
                      </small>
                    )}
                  </div>
                  <div className="flex items-center rounded-full bg-yuzey p-1" role="group" aria-label={T.secim.adetAria(x.ad, x.n)}>
                    <button type="button" aria-label={T.secim.azalt(x.ad)} onClick={() => degis(x.k, -1)} className="grid size-11 place-items-center rounded-full">
                      <Minus size={18} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                    <span className="min-w-6 text-center font-semibold tabular-nums">{x.n}</span>
                    <button type="button" aria-label={T.secim.arttir(x.ad)} onClick={() => degis(x.k, 1)} className="grid size-11 place-items-center rounded-full">
                      <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between pt-3 text-lg font-semibold">
              <span>{T.secim.toplam}</span>
              <b className="text-[28px] tabular-nums">{tl(toplamTutar(liste))}</b>
            </div>
            <p className="pt-1 text-center text-[13px] text-soluk">{T.secim.saklama}</p>
            <button
              type="button"
              onClick={() => {
                listeyiTemizle();
                titret(6);
              }}
              className="mx-auto mt-1 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold underline underline-offset-4"
            >
              {T.secim.temizle}
            </button>
          </>
        )}
      </div>
      {liste.length > 0 && (
        <div className="border-t border-cizgi px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={onGoster} className="min-h-12 w-full rounded-full bg-sari px-4 text-base font-semibold">
            {T.secim.goster}
          </button>
        </div>
      )}
    </SayfaKabi>
  );
}
