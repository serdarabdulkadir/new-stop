"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { type UrunKat } from "@/lib/menu";
import { listeyeEkle, toplamAdet, toplamTutar, useListe } from "@/lib/liste";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { sesiHazirla, tik } from "@/lib/ses";
import { titret } from "@/lib/haptik";
import { Acilis } from "./Acilis";
import { Menu, kategoriyeKay } from "./Menu";
import { UrunSayfasi, type EkleDetay } from "./UrunSayfasi";
import { Secimler } from "./Secimler";
import { Arama } from "./Arama";
import { Garson } from "./Garson";
import { IsletmeBilgisi } from "./IsletmeBilgisi";

type Ucus = { id: number; x0: number; y0: number; x1: number; y1: number };

export function App() {
  const azalt = useReducedMotion();
  const liste = useListe();
  const [acilis, setAcilis] = useState(true);
  const [urun, setUrun] = useState<UrunKat | null>(null);
  const [secim, setSecim] = useState(false);
  const [arama, setArama] = useState(false);
  const [garson, setGarson] = useState(false);
  const [bilgi, setBilgi] = useState(false);
  const [ucuslar, setUcuslar] = useState<Ucus[]>([]);
  const [ziplama, setZiplama] = useState(0);
  const rozet = useRef<HTMLSpanElement>(null);
  const sayac = useRef(0);
  const adet = toplamAdet(liste);

  useEffect(() => sesiHazirla(), []);

  // Açılış görünürken arkadaki sayfa kaymasın
  useEffect(() => {
    if (!acilis) return;
    const onceki = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = onceki;
    };
  }, [acilis]);

  // Ekleme: liste + tık sesi + titreşim; sarı nokta kavisle sayaç rozetine uçar
  const ekle = useCallback(
    (d: { id: string; ad: string; f: number; n?: number; s?: string; not?: string }, kaynak: DOMRect | null, ilk: boolean) => {
      listeyeEkle(d);
      tik();
      titret(8);
      if (azalt || !kaynak) {
        if (!azalt) setZiplama((z) => z + 1);
        return;
      }
      window.setTimeout(
        () => {
          const hedef = rozet.current?.getBoundingClientRect();
          if (!hedef) return;
          setUcuslar((l) => [
            ...l,
            {
              id: ++sayac.current,
              x0: kaynak.left + kaynak.width / 2 - 8,
              y0: kaynak.top + kaynak.height / 2 - 8,
              x1: hedef.left + hedef.width / 2 - 8,
              y1: hedef.top + hedef.height / 2 - 8,
            },
          ]);
        },
        ilk ? 380 : 0,
      );
    },
    [azalt],
  );

  const hizliEkle = useCallback(
    (u: UrunKat, kaynak: DOMRect | null) => ekle({ id: u.id, ad: u.ad, f: u.fiyat }, kaynak, adet === 0),
    [ekle, adet],
  );

  const urunEkle = (d: EkleDetay, kaynak: DOMRect) => {
    setUrun(null);
    ekle({ id: d.u.id, ad: d.u.ad, f: d.u.fiyat, n: d.n, s: d.s, not: d.not }, kaynak, adet === 0);
  };

  const gosterAc = () => {
    setSecim(false);
    setGarson(true);
  };
  const garsonKapat = useCallback(() => setGarson(false), []);
  const urunKapat = useCallback(() => setUrun(null), []);
  const secimKapat = useCallback(() => setSecim(false), []);
  const aramaKapat = useCallback(() => setArama(false), []);
  const bilgiKapat = useCallback(() => setBilgi(false), []);
  const gecAc = useCallback(() => setAcilis(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto min-h-dvh w-full max-w-[480px] bg-zemin pb-28" inert={acilis}>
        <Menu onAc={setUrun} onEkle={hizliEkle} onAra={() => setArama(true)} onBilgi={() => setBilgi(true)} />
      </main>

      <AnimatePresence>{acilis && <Acilis onGec={gecAc} />}</AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <AnimatePresence>
          {adet > 0 && !acilis && (
            <motion.button
              type="button"
              onClick={() => setSecim(true)}
              aria-label={T.secim.cubukAria}
              className="pointer-events-auto mx-auto flex w-full max-w-[448px] items-center gap-3 rounded-full bg-ink px-5 py-3 text-beyaz shadow-[0_2px_12px_rgba(22,22,21,0.12)]"
              initial={{ y: "160%" }}
              animate={{ y: 0 }}
              exit={{ y: "160%" }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span
                ref={rozet}
                className="grid size-7 place-items-center rounded-full bg-sari text-sm font-bold text-ink tabular-nums"
              >
                <motion.span
                  key={ziplama}
                  initial={ziplama ? { scale: 1.5 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                >
                  {adet}
                </motion.span>
              </span>
              <span className="font-medium">{T.secim.baslik}</span>
              <span className="flex-1" />
              <span className="font-semibold tabular-nums">{tl(toplamTutar(liste))}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {ucuslar.map((c) => (
        <motion.div
          key={c.id}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[100] size-4 rounded-full border-2 border-ink bg-sari"
          initial={{ x: c.x0, y: c.y0, scale: 1 }}
          animate={{
            x: [c.x0, (c.x0 + c.x1) / 2, c.x1],
            y: [c.y0, Math.min(c.y0, c.y1) - 90, c.y1],
            scale: [1, 1.3, 0.6],
          }}
          transition={{ duration: 0.62, times: [0, 0.45, 1], ease: "easeInOut" }}
          onAnimationComplete={() => {
            setUcuslar((l) => l.filter((x) => x.id !== c.id));
            setZiplama((z) => z + 1);
          }}
        />
      ))}

      <UrunSayfasi urun={urun} kapat={urunKapat} onEkle={urunEkle} />
      <Secimler acik={secim} kapat={secimKapat} liste={liste} onGoster={gosterAc} />
      <IsletmeBilgisi acik={bilgi} kapat={bilgiKapat} />
      <Arama
        acik={arama}
        kapat={aramaKapat}
        onAc={(u) => {
          setArama(false);
          setUrun(u);
        }}
        onEkle={hizliEkle}
        onKategori={(id) => {
          setArama(false);
          window.setTimeout(() => kategoriyeKay(id), 250);
        }}
      />
      <AnimatePresence>{garson && <Garson liste={liste} kapat={garsonKapat} />}</AnimatePresence>
    </MotionConfig>
  );
}
