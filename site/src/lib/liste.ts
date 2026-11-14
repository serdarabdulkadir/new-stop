"use client";
// "Seçtiklerim" listesi: localStorage'da 30 dk. Dış depo + useSyncExternalStore.
import { useSyncExternalStore } from "react";

export type Satir = { k: string; id: string; ad: string; f: number; n: number; s: string; not: string };

const ANAHTAR = "ns-liste";
const SURE = 30 * 60 * 1000;
const BOS: readonly Satir[] = [];

let durum: readonly Satir[] = BOS;
let yuklendi = false;
const dinleyen = new Set<() => void>();

function oku(): readonly Satir[] {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    if (!ham) return BOS;
    const d = JSON.parse(ham) as { t?: number; u?: Satir[] };
    if (typeof d.t === "number" && Array.isArray(d.u) && Date.now() - d.t < SURE) return d.u;
    localStorage.removeItem(ANAHTAR); // süresi doldu
  } catch {
    /* yut */
  }
  return BOS;
}

function yayinla() {
  dinleyen.forEach((f) => f());
}

function yaz(yeni: readonly Satir[]) {
  durum = yeni;
  try {
    if (yeni.length) localStorage.setItem(ANAHTAR, JSON.stringify({ t: Date.now(), u: yeni }));
    else localStorage.removeItem(ANAHTAR);
  } catch {
    /* yut */
  }
  yayinla();
}

function abone(f: () => void) {
  dinleyen.add(f);
  if (dinleyen.size === 1) document.addEventListener("visibilitychange", tazele);
  return () => {
    dinleyen.delete(f);
    if (dinleyen.size === 0) document.removeEventListener("visibilitychange", tazele);
  };
}

// Sekmeye dönünce süre dolmuş mu / başka sekme değiştirdi mi bak
function tazele() {
  if (document.visibilityState !== "visible") return;
  const yeni = oku();
  if (JSON.stringify(yeni) !== JSON.stringify(durum)) {
    durum = yeni;
    yayinla();
  }
}

function anlik(): readonly Satir[] {
  if (!yuklendi) {
    yuklendi = true;
    durum = oku();
  }
  return durum;
}

export type YeniSatir = { id: string; ad: string; f: number; n?: number; s?: string; not?: string };

export function listeyeEkle(u: YeniSatir) {
  const s = u.s ?? "";
  const not = u.not ?? "";
  const k = `${u.id}|${s}|${not}`;
  const mevcut = anlik();
  const var_ = mevcut.find((x) => x.k === k);
  yaz(
    var_
      ? mevcut.map((x) => (x.k === k ? { ...x, n: x.n + (u.n ?? 1) } : x))
      : [...mevcut, { k, id: u.id, ad: u.ad, f: u.f, n: u.n ?? 1, s, not }],
  );
}

export function adetDegistir(k: string, fark: number) {
  yaz(
    anlik()
      .map((x) => (x.k === k ? { ...x, n: x.n + fark } : x))
      .filter((x) => x.n > 0),
  );
}

export function listeyiTemizle() {
  yaz(BOS);
}

export const toplamTutar = (l: readonly Satir[]) => l.reduce((a, x) => a + x.f * x.n, 0);
export const toplamAdet = (l: readonly Satir[]) => l.reduce((a, x) => a + x.n, 0);

export function useListe(): readonly Satir[] {
  return useSyncExternalStore(abone, anlik, () => BOS);
}
