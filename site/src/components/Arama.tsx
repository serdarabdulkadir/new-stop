"use client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Plus, Search, X } from "lucide-react";
import { KATEGORILER, VITRIN, katBul, type UrunKat } from "@/lib/menu";
import { SUZGECLER, ara, kategoriEsles, vurguMaskesi, type Suzgec } from "@/lib/arama";
import { ONERILER, type Oneri } from "@/lib/oneriler";
import { sonEkle, sonOku, sonTemizle } from "@/lib/sonarama";
import { tl } from "@/lib/bicim";
import { T } from "@/lib/metin";
import { SayfaKabi } from "./Sayfa";
import { KategoriIkon } from "./KategoriIkon";

const CIP = "min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-150";

function Vurgu({ ad, q }: { ad: string; q: string }) {
  const m = vurguMaskesi(ad, q);
  if (!m.some(Boolean)) return <>{ad}</>;
  return (
    <>
      {Array.from(ad).map((c, i) => (
        <Fragment key={i}>{m[i] ? <b className="font-bold">{c}</b> : c}</Fragment>
      ))}
    </>
  );
}

export function Arama({
  acik, kapat, onAc, onEkle, onKategori,
}: {
  acik: boolean;
  kapat: () => void;
  onAc: (u: UrunKat) => void;
  onEkle: (u: UrunKat, kaynak: DOMRect) => void;
  onKategori: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [d, setD] = useState("");
  const [suzgec, setSuzgec] = useState<Suzgec[]>([]);
  const [son, setSon] = useState<string[]>([]);
  const [ruh, setRuh] = useState<Oneri | null>(null);
  const girdi = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!acik) return;
    const t0 = window.setTimeout(() => setSon(sonOku()), 0);
    // iOS'ta drawer animasyonu bitince odakla
    const t = window.setTimeout(() => girdi.current?.focus(), 380);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t);
    };
  }, [acik]);

  useEffect(() => {
    const t = window.setTimeout(() => setD(q), 120);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!acik) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && kapat();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [acik, kapat]);

  const yazildi = d.trim().length > 0;
  const aktifSuzgec = suzgec.length > 0;
  const sonuc = useMemo(() => (yazildi || aktifSuzgec ? ara(d, suzgec) : []), [d, suzgec, yazildi, aktifSuzgec]);
  const gruplar = useMemo(() => {
    const m = new Map<string, UrunKat[]>();
    sonuc.forEach((u) => m.set(u.katId, [...(m.get(u.katId) ?? []), u]));
    return [...m.entries()];
  }, [sonuc]);
  const katlar = useMemo(() => (yazildi ? kategoriEsles(d) : []), [d, yazildi]);
  const liste = yazildi || aktifSuzgec;

  const kaydet = () => yazildi && sonuc.length > 0 && setSon(sonEkle(d));
  const ac = (u: UrunKat) => {
    kaydet();
    onAc(u);
  };
  const sec = (f: Suzgec) => setSuzgec((l) => (l.includes(f) ? l.filter((x) => x !== f) : [...l, f]));
  const git = (id: string) => {
    if (yazildi) kaydet();
    onKategori(id);
  };

  const satir = (u: UrunKat, goster: boolean) => (
    <li key={u.id} className="flex items-center gap-3 border-b border-cizgi py-2.5">
      <button type="button" onClick={() => ac(u)} aria-label={T.menu.ayrintiAria(u.ad)} className="min-h-11 min-w-0 flex-1 text-start">
        <span className="block text-[17px] leading-snug font-medium">{goster ? <Vurgu ad={u.ad} q={d} /> : u.ad}</span>
      </button>
      <span className="text-base font-semibold whitespace-nowrap tabular-nums">{tl(u.fiyat)}</span>
      <button
        type="button"
        aria-label={T.menu.ekleAria(u.ad)}
        onClick={(e) => (u.surup ? ac(u) : onEkle(u, e.currentTarget.getBoundingClientRect()))}
        className="grid size-11 flex-none place-items-center rounded-full bg-yuzey"
      >
        <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </li>
  );

  const baslik = (t: string) => <h3 className="pt-4 pb-1 text-[13px] font-semibold text-soluk">{t}</h3>;

  return (
    <SayfaKabi acik={acik} kapat={kapat} baslik={T.arama.baslik} tam>
      <div className="flex items-center gap-2 px-4 pt-1.5 pb-2">
        {ruh && (
          <button type="button" onClick={() => setRuh(null)} aria-label={T.arama.geri} className="grid size-11 flex-none place-items-center rounded-full bg-yuzey">
            <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
        {ruh ? (
          <h2 className="flex-1 text-xl font-semibold">{ruh.ad}</h2>
        ) : (
          <form
            role="search"
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              kaydet();
              girdi.current?.blur();
            }}
          >
            <Search size={20} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-4 my-auto text-soluk" />
            <input
              ref={girdi}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={T.arama.yer}
              aria-label={T.arama.yer}
              enterKeyHint="search"
              autoComplete="off"
              className="h-[52px] w-full rounded-full bg-yuzey ps-12 pe-12 text-base text-ink placeholder:text-soluk [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button
                type="button"
                aria-label={T.arama.temizle}
                onClick={() => {
                  setQ("");
                  setD("");
                  girdi.current?.focus();
                }}
                className="absolute inset-y-0 end-1 my-auto grid size-11 place-items-center rounded-full"
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
          </form>
        )}
        <button type="button" onClick={kapat} aria-label={T.arama.kapat} className="grid size-11 flex-none place-items-center rounded-full bg-yuzey">
          <X size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {!ruh && (
        <div role="group" aria-label={T.arama.suzgecAria} className="serit flex gap-2 overflow-x-auto px-4 pb-2">
          {SUZGECLER.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={suzgec.includes(f)}
              onClick={() => sec(f)}
              className={`${CIP} flex-none whitespace-nowrap ${suzgec.includes(f) ? "bg-ink text-beyaz" : "bg-yuzey text-ink"}`}
            >
              {T.arama.suzgec[f]}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {ruh && <ul>{ruh.urunler.map((u) => satir(u, false))}</ul>}

        {!ruh && liste && (
          <>
            <p className="sr-only" role="status" aria-live="polite">
              {T.arama.sonuc(sonuc.length)}
            </p>
            {katlar.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => git(k.id)}
                className="mt-2 flex min-h-11 w-full items-center gap-2.5 rounded-xl bg-yuzey px-3.5 text-start font-medium"
              >
                <KategoriIkon ad={k.ikon} boyut={20} />
                {T.arama.kategoriyeGit(k.ad)}
              </button>
            ))}
            {gruplar.map(([id, urunler]) => (
              <div key={id}>
                {baslik(katBul(id)?.ad ?? "")}
                <ul>{urunler.map((u) => satir(u, yazildi))}</ul>
              </div>
            ))}
            {sonuc.length === 0 && (
              <div className="grid justify-items-start gap-3 py-6" role="status">
                <p className="text-lg font-semibold">{yazildi ? T.arama.sonucYok(d.trim()) : T.arama.sonucYokSuzgec}</p>
                <p className="text-soluk">{T.arama.bakabilirsin}</p>
                <div className="flex flex-wrap gap-2">
                  {ONERILER.slice(0, 3).map((o) => (
                    <button key={o.id} type="button" onClick={() => setRuh(o)} className={`${CIP} bg-yuzey`}>
                      {o.ad}
                    </button>
                  ))}
                </div>
                {aktifSuzgec && (
                  <button type="button" onClick={() => setSuzgec([])} className="min-h-11 rounded-full px-1 text-sm font-semibold underline underline-offset-4">
                    {T.arama.suzgecTemizle}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {!ruh && !liste && (
          <>
            {son.length > 0 && (
              <section>
                <div className="flex items-center justify-between pt-3">
                  <h3 className="text-[13px] font-semibold text-soluk">{T.arama.sonAramalar}</h3>
                  <button
                    type="button"
                    aria-label={T.arama.sonTemizleAria}
                    onClick={() => setSon(sonTemizle())}
                    className="min-h-11 px-1 text-sm font-semibold underline underline-offset-4"
                  >
                    {T.arama.sonTemizle}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {son.map((x) => (
                    <button key={x} type="button" onClick={() => { setQ(x); setD(x); }} className={`${CIP} bg-yuzey`}>
                      {x}
                    </button>
                  ))}
                </div>
              </section>
            )}
            <section>
              {baslik(T.arama.ruhHali)}
              <div className="flex flex-wrap gap-2">
                {ONERILER.map((o) => (
                  <button key={o.id} type="button" onClick={() => setRuh(o)} className={`${CIP} bg-yuzey`}>
                    {o.ad}
                  </button>
                ))}
              </div>
            </section>
            <section>
              {baslik(T.arama.sik)}
              <div className="flex flex-wrap gap-2">
                {VITRIN.map((u) => (
                  <button key={u.id} type="button" onClick={() => ac(u)} className={`${CIP} bg-yuzey`}>
                    {u.ad}
                  </button>
                ))}
              </div>
            </section>
            <section>
              {baslik(T.arama.kategoriler)}
              <ul className="grid grid-cols-2 gap-x-4">
                {KATEGORILER.map((k) => (
                  <li key={k.id}>
                    <button type="button" onClick={() => git(k.id)} className="flex min-h-12 w-full items-center gap-2.5 border-b border-cizgi py-2 text-start">
                      <KategoriIkon ad={k.ikon} boyut={20} className="flex-none" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{k.ad}</span>
                        <span className="block text-xs text-soluk">{T.arama.urunSay(k.urunler.length)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </SayfaKabi>
  );
}
