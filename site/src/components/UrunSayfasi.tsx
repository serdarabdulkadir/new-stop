"use client";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { SURUPLAR, katBul, type UrunKat } from "@/lib/menu";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { titret } from "@/lib/haptik";
import { SayfaKabi } from "./Sayfa";
import { KategoriIkon } from "./KategoriIkon";

export type EkleDetay = { u: UrunKat; n: number; s: string; not: string };

export function UrunSayfasi({
  urun,
  kapat,
  onEkle,
}: {
  urun: UrunKat | null;
  kapat: () => void;
  onEkle: (d: EkleDetay, kaynak: DOMRect) => void;
}) {
  return (
    <SayfaKabi acik={urun !== null} kapat={kapat} baslik={urun?.ad ?? T.urun.kapat}>
      {urun && <Icerik key={urun.id} u={urun} onEkle={onEkle} />}
    </SayfaKabi>
  );
}

function Icerik({ u, onEkle }: { u: UrunKat; onEkle: (d: EkleDetay, kaynak: DOMRect) => void }) {
  const [n, setN] = useState(1);
  const [s, setS] = useState("");
  const secenekler = u.surup ? [T.urun.surupsuz, ...SURUPLAR] : [];
  const katIkon = katBul(u.katId)?.ikon ?? "Coffee";

  return (
    <>
      <div className="grid gap-3.5 overflow-y-auto overscroll-contain px-4 pt-1.5 pb-4">
        {/* Ürün Görseli veya Şık Kategori Vitrini */}
        {u.foto ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40 shadow-xs">
            <Image
              src={u.foto}
              alt={u.ad}
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 448px"
            />
          </div>
        ) : (
          <div className="relative flex h-36 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-cizgi/50 bg-gradient-to-b from-yuzey/80 via-yuzey to-yuzey/40 p-4">
            <div className="flex size-18 items-center justify-center rounded-2xl bg-sari/25 border border-sari/50 text-ink shadow-xs">
              <KategoriIkon ad={katIkon} boyut={36} hareketli={true} />
            </div>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-zemin/90 px-3 py-0.5 text-xs font-semibold text-soluk border border-cizgi/40">
              {u.katAd}
            </span>
          </div>
        )}

        {/* Ürün Adı ve Fiyat */}
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <h3 className="text-[26px] leading-tight font-bold tracking-tight text-ink">{u.ad}</h3>
          <span className="text-2xl font-bold whitespace-nowrap tabular-nums text-ink">{tl(u.fiyat)}</span>
        </div>

        {/* Arapça İsim */}
        {u.ar && (
          <p lang="ar" dir="rtl" className="-mt-1.5 text-base text-soluk">
            {u.ar}
          </p>
        )}

        {/* Ürün Açıklaması / Notu */}
        {u.not && (
          <div className="rounded-xl bg-yuzey/60 px-3.5 py-2.5 text-[14px] leading-relaxed text-soluk border border-cizgi/40">
            {u.not}
          </div>
        )}

        {/* Şurup Seçimi */}
        {u.surup && (
          <div className="grid gap-2 pt-1">
            <div className="text-[14px] font-semibold text-ink">{T.urun.surupBaslik}</div>
            <div className="flex flex-wrap gap-2">
              {secenekler.map((x) => {
                const deger = x === T.urun.surupsuz ? "" : x;
                const secili = s === deger;
                return (
                  <button
                    key={x}
                    type="button"
                    aria-pressed={secili}
                    onClick={() => {
                      setS(deger);
                      titret(5);
                    }}
                    className={`min-h-10 rounded-full px-4 text-sm font-medium transition-colors duration-150 ${
                      secili ? "bg-ink text-beyaz" : "bg-yuzey text-ink"
                    }`}
                  >
                    {x}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Alt Bar: Adet ve Ekle */}
      <div className="flex items-center gap-2.5 border-t border-cizgi px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center rounded-full bg-yuzey p-1" role="group" aria-label={T.urun.adet}>
          <button
            type="button"
            aria-label={T.urun.azalt}
            onClick={() => {
              if (n > 1) {
                setN(n - 1);
                titret(4);
              }
            }}
            className="grid size-11 place-items-center rounded-full active:scale-95 transition-transform"
          >
            <Minus size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <span className="min-w-6 text-center font-semibold tabular-nums text-ink" aria-live="polite">
            {n}
          </span>
          <button
            type="button"
            aria-label={T.urun.arttir}
            onClick={() => {
              setN(n + 1);
              titret(4);
            }}
            className="grid size-11 place-items-center rounded-full active:scale-95 transition-transform"
          >
            <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => onEkle({ u, n, s, not: "" }, e.currentTarget.getBoundingClientRect())}
          className="min-h-12 flex-1 rounded-full bg-sari px-4 text-base font-bold text-ink shadow-xs transition-transform active:scale-[0.98]"
        >
          {T.urun.ekle(u.fiyat * n)}
        </button>
      </div>
    </>
  );
}
