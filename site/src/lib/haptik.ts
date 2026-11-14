// Tek haptik yardımcı: Android'de navigator.vibrate, iOS 18+ Safari'de
// <input type="checkbox" switch> + label.click() hilesi. Hata olursa sessizce geçer.

let anahtar: HTMLLabelElement | null = null;

function iosAnahtar(): HTMLLabelElement | null {
  if (anahtar) return anahtar;
  try {
    // Özellik tespiti: iOS WebKit + dokunmatik. Diğer tarayıcılarda hiçbir şey eklenmez.
    const webkitIos =
      typeof CSS !== "undefined" && CSS.supports("-webkit-touch-callout", "none");
    if (!webkitIos || navigator.maxTouchPoints < 1) return null;
    const girdi = document.createElement("input");
    girdi.type = "checkbox";
    girdi.setAttribute("switch", "");
    girdi.id = "haptik-anahtar";
    girdi.tabIndex = -1;
    girdi.setAttribute("aria-hidden", "true");
    const etiket = document.createElement("label");
    etiket.htmlFor = girdi.id;
    etiket.setAttribute("aria-hidden", "true");
    const stil =
      "position:fixed;left:-100px;top:-100px;width:1px;height:1px;opacity:0;pointer-events:none;";
    girdi.style.cssText = stil;
    etiket.style.cssText = stil;
    document.body.append(girdi, etiket);
    anahtar = etiket;
    return anahtar;
  } catch {
    return null;
  }
}

/** Kısa titreşim. ms: süre ya da desen. Kullanıcı dokunuşu içinde çağır. */
export function titret(ms: number | number[] = 8): void {
  try {
    if (typeof navigator === "undefined") return;
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(ms);
      return;
    }
    iosAnahtar()?.click();
  } catch {
    /* yut */
  }
}
