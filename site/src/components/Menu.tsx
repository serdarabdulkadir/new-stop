"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Info, Plus, Search } from "lucide-react";
import { KATEGORILER, KAT_URUNLERI, VITRIN, type Kategori, type UrunKat } from "@/lib/menu";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { titret } from "@/lib/haptik";
import { RuhHali } from "./RuhHali";
import { KategoriIkon } from "./KategoriIkon";

export type Ac = (u: UrunKat) => void;
export type Ekle = (u: UrunKat, kaynak: DOMRect | null) => void;

const SON = KATEGORILER[KATEGORILER.length - 1].id;

/** Kategori bölümüne kaydır (hap, arama önerisi). */
export function kategoriyeKay(id: string) {
  const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(`kat-${id}`)?.scrollIntoView({ behavior: azalt ? "auto" : "smooth", block: "start" });
}

const Satir = memo(function Satir({ u, onAc, onEkle }: { u: UrunKat; onAc: Ac; onEkle: Ekle }) {
  const [basti, setBasti] = useState(false);
  const not = u.not ?? (u.surup ? T.menu.surupNotu : "");
  return (
    <li className="flex items-center gap-3.5 border-b border-cizgi py-3">
      {u.foto && (
        <Image src={u.foto} alt="" width={56} height={56} loading="lazy" className="size-14 flex-none rounded-xl bg-yuzey object-cover" />
      )}
      <button
        type="button"
        onClick={() => onAc(u)}
        aria-label={T.menu.ayrintiAria(u.ad)}
        className="min-h-11 min-w-0 flex-1 text-start"
      >
        <span className="block text-[17px] leading-snug font-medium">{u.ad}</span>
        {not && <span className="mt-0.5 block text-[13px] leading-snug text-soluk">{not}</span>}
      </button>
      <span className="text-base font-semibold whitespace-nowrap tabular-nums">{tl(u.fiyat)}</span>
      <button
        type="button"
        aria-label={T.menu.ekleAria(u.ad)}
        onClick={(e) => {
          if (u.surup) return onAc(u);
          setBasti(true);
          window.setTimeout(() => setBasti(false), 260);
          onEkle(u, e.currentTarget.getBoundingClientRect());
        }}
        className={`grid size-11 flex-none place-items-center rounded-full transition-[transform,background-color,color] duration-150 ${
          basti ? "scale-110 bg-ink text-beyaz" : "bg-yuzey text-ink"
        }`}
      >
        <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </li>
  );
});

function Vitrin({ onAc }: { onAc: Ac }) {
  const [ref] = useEmblaCarousel({ dragFree: true, align: "start", containScroll: "trimSnaps" });
  return (
    <div className="overflow-hidden" ref={ref}>
      <div className="flex gap-3 px-4">
        {VITRIN.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => onAc(u)}
            aria-label={T.menu.ayrintiAria(u.ad)}
            className="grid min-w-0 flex-[0_0_132px] content-start gap-1.5 text-start"
          >
            <Image
              src={u.foto ?? ""}
              alt=""
              width={132}
              height={164}
              className="h-[164px] w-[132px] rounded-xl bg-yuzey object-cover"
            />
            <span className="text-sm leading-tight font-medium">{u.ad}</span>
            <span className="text-[13px] leading-tight text-soluk">
              {u.katAd} · <span className="tabular-nums">{tl(u.fiyat)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Bolum({ k, aktif, son, onAc, onEkle }: { k: Kategori; aktif: boolean; son: boolean; onAc: Ac; onEkle: Ekle }) {
  return (
    <section
      id={`kat-${k.id}`}
      aria-labelledby={`bas-${k.id}`}
      className={`scroll-mt-[61px] ${son ? "min-h-[calc(100dvh-61px)]" : ""}`}
    >
      <div className="flex items-end gap-3 px-4 pt-6 pb-1">
        <div className="min-w-0 flex-1">
          <h2 id={`bas-${k.id}`} className="text-[34px] leading-none font-bold tracking-[-0.03em]">
            {k.ad}
          </h2>
          <p className="mt-1.5 text-sm text-soluk">{T.menu.cesit(k.urunler.length)}</p>
        </div>
        <KategoriIkon ad={k.ikon} boyut={44} hareketli={aktif} className="flex-none" />
      </div>
      <ul className="px-4">
        {KAT_URUNLERI[k.id].map((u) => (
          <Satir key={u.id} u={u} onAc={onAc} onEkle={onEkle} />
        ))}
      </ul>
    </section>
  );
}

export function Menu({
  onAc,
  onEkle,
  onAra,
  onBilgi,
}: {
  onAc: Ac;
  onEkle: Ekle;
  onAra: () => void;
  onBilgi: () => void;
}) {
  const [aktif, setAktif] = useState(KATEGORILER[0].id);
  const [yapis, setYapis] = useState(false);
  const serit = useRef<HTMLElement>(null);
  const kilit = useRef(0);
  const hesapRef = useRef<() => void>(() => {});

  // scroll-spy
  useEffect(() => {
    let raf = 0;
    const hesapla = () => {
      raf = 0;
      const sh = serit.current;
      if (!sh) return;
      setYapis(sh.getBoundingClientRect().top <= 0);
      if (kilit.current > Date.now()) return;
      const esik = sh.offsetHeight + 24;
      let id = KATEGORILER[0].id;
      for (const k of KATEGORILER) {
        const el = document.getElementById(`kat-${k.id}`);
        if (el && el.getBoundingClientRect().top <= esik) id = k.id;
        else break;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) id = SON;
      setAktif(id);
    };
    hesapRef.current = hesapla;
    const f = () => {
      if (!raf) raf = requestAnimationFrame(hesapla);
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => {
      window.removeEventListener("scroll", f);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // aktif hap görünür alana kayar (yalnız şeritte, sayfa kaymaz)
  useEffect(() => {
    const sh = serit.current;
    const b = sh?.querySelector<HTMLElement>(`[data-k="${aktif}"]`);
    if (!sh || !b) return;
    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sh.scrollTo({ left: b.offsetLeft - (sh.clientWidth - b.offsetWidth) / 2, behavior: azalt ? "auto" : "smooth" });
  }, [aktif]);

  const hapaBas = useCallback((id: string) => {
    setAktif(id);
    titret(5);
    kilit.current = Date.now() + 1200;
    const birak = () => {
      kilit.current = 0;
      hesapRef.current();
    };
    window.addEventListener("scrollend", birak, { once: true });
    window.setTimeout(() => {
      window.removeEventListener("scrollend", birak);
      if (kilit.current) birak();
    }, 1200);
    kategoriyeKay(id);
  }, []);

  return (
    <>
      <header className="flex items-center gap-2.5 px-4 py-2.5">
        <Image src="/img/logo.png" alt={T.logoAlt} width={36} height={36} className="size-9 rounded-full bg-sari object-cover" priority />
        <span className="text-[13px] tracking-[0.28em]">{T.marka}</span>
        <span className="flex-1" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBilgi}
            aria-label="İşletme Bilgisi"
            className="grid size-11 place-items-center rounded-full bg-yuzey text-ink transition-transform active:scale-95"
          >
            <Info size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onAra}
            aria-label={T.menu.ara}
            className="grid size-11 place-items-center rounded-full bg-yuzey text-ink transition-transform active:scale-95"
          >
            <Search size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </header>

      <h2 className="px-4 pt-1.5 pb-2.5 text-xl font-semibold">{T.menu.vitrin}</h2>
      <Vitrin onAc={onAc} />
      <RuhHali onAc={onAc} onEkle={onEkle} />

      <nav
        ref={serit}
        aria-label={T.menu.kategoriler}
        className={`serit sticky top-0 z-20 mt-4 flex gap-2 overflow-x-auto border-b bg-zemin px-4 py-2 transition-colors duration-200 ${
          yapis ? "border-cizgi" : "border-transparent"
        }`}
      >
        {KATEGORILER.map((k) => (
          <button
            key={k.id}
            type="button"
            data-k={k.id}
            onClick={() => hapaBas(k.id)}
            aria-current={k.id === aktif ? "true" : undefined}
            className={`inline-flex min-h-11 flex-none items-center gap-1.5 rounded-full py-2 ps-3 pe-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              k.id === aktif ? "bg-ink text-sari" : "bg-yuzey text-ink"
            }`}
          >
            <KategoriIkon ad={k.ikon} boyut={20} />
            {k.ad}
          </button>
        ))}
      </nav>

      {KATEGORILER.map((k) => (
        <Bolum key={k.id} k={k} aktif={k.id === aktif} son={k.id === SON} onAc={onAc} onEkle={onEkle} />
      ))}
      <p className="px-4 pt-6 pb-8 text-center text-[13px] text-soluk">{T.menu.dip}</p>
    </>
  );
}
