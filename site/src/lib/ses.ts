// Web Audio ile sentez: zil (iki nota) ve tık. AudioContext ilk dokunuşta açılır.

let ctx: AudioContext | null = null;

function baglam(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const C =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** İlk dokunuşta bağlamı oluşturur ve uyandırır (tarayıcı otomatik oynatma kuralı). */
export function sesiHazirla(): () => void {
  const ac = () => {
    baglam();
  };
  window.addEventListener("pointerdown", ac, { once: true, passive: true });
  window.addEventListener("keydown", ac, { once: true });
  return () => {
    window.removeEventListener("pointerdown", ac);
    window.removeEventListener("keydown", ac);
  };
}

function ton(f: number, bekle: number, sure: number, tip: OscillatorType, kazanc: number) {
  const c = baglam();
  if (!c) return;
  const o = c.createOscillator();
  const v = c.createGain();
  const t = c.currentTime + bekle;
  o.type = tip;
  o.frequency.value = f;
  v.gain.setValueAtTime(0, t);
  v.gain.linearRampToValueAtTime(kazanc, t + 0.01);
  v.gain.exponentialRampToValueAtTime(0.001, t + sure);
  o.connect(v).connect(c.destination);
  o.start(t);
  o.stop(t + sure + 0.05);
}

function cinla(f: number, bekle: number) {
  ton(f, bekle, 1.2, "sine", 0.26);
  ton(f * 2.76, bekle, 0.45, "sine", 0.05);
}

/** İki notalı zil (STOP düğmesi). */
export function zil(): void {
  cinla(659, 0);
  cinla(523, 0.32);
}

/** Kısa tık (ekleme). */
export function tik(): void {
  ton(1320, 0, 0.07, "triangle", 0.12);
  ton(1760, 0.04, 0.08, "sine", 0.06);
}
