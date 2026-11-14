"use client";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { SayfaKabi } from "./Sayfa";

// Çalışma saati 09:00–23:30, Türkiye saatine göre hesaplanır (cihaz saat dilimi ne olursa olsun)
function acikMi(): boolean {
  const s = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  const [h, m] = s.split(":").map(Number);
  const dk = h * 60 + m;
  return dk >= 9 * 60 && dk < 23 * 60 + 30;
}

function AcikDurum() {
  const acik = acikMi();
  return (
    <p className="flex items-center gap-2 text-[15px] font-medium text-soluk">
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${acik ? "bg-ink" : "border border-soluk"}`}
      />
      {acik ? "Şu an açık · 23:30’a kadar" : "Şu an kapalı · 09:00’da açılır"}
    </p>
  );
}

export function IsletmeBilgisi({
  acik,
  kapat,
}: {
  acik: boolean;
  kapat: () => void;
}) {
  return (
    <SayfaKabi acik={acik} kapat={kapat} baslik="New Stop Hakkında">
      <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-8">
        {/* Başlık ve Durum Rozeti */}
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-[34px] font-bold leading-tight tracking-[-0.03em] text-ink">
            new stop?
          </h2>
          <AcikDurum />
        </div>

        {/* Konsept ve Açıklama (Doğal, ferah ve kutusuz tasarım) */}
        <div className="mt-5 flex items-center gap-4">
          <Image
            src="/img/logo.png"
            alt="New Stop"
            width={64}
            height={64}
            className="size-[64px] flex-none object-contain drop-shadow-xs"
          />
          <p className="text-[14px] leading-relaxed text-soluk font-normal">
            Durağında in, bir kahve molası ver. Karadeniz Teknik Üniversitesi Fatih Kampüsü yanı ve Söğütlü sahilinde lezzetli kahveler, tatlılar ve keyifli bir durak için her zaman seninleyiz.
          </p>
        </div>

        {/* Çalışma Saatleri */}
        <div className="mt-5 border-t border-cizgi pt-4">
          <span className="block text-[13px] font-medium text-soluk">
            Saat
          </span>
          <p className="mt-1 text-base font-semibold text-ink">
            Her gün 09:00 – 23:30
          </p>
        </div>

        {/* Adres */}
        <div className="mt-4 border-t border-cizgi pt-4">
          <span className="block text-[13px] font-medium text-soluk">
            Adres
          </span>
          <p className="mt-1 text-[15px] font-medium leading-snug text-ink">
            Söğütlü Mah. Sahil Cad., Akçaabat / Trabzon
          </p>
        </div>

        {/* Yol Tarifi Düğmesi */}
        <div className="mt-5">
          <a
            href="https://www.google.com/maps/search/?api=1&query=New+Stop+Cafe+Söğütlü+Akçaabat+Trabzon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-base font-semibold text-beyaz shadow-xs transition-transform active:scale-[0.98]"
          >
            <MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>Yol tarifi al</span>
          </a>
        </div>

        {/* Sosyal Medya & Fotoğraflar */}
        <div className="mt-6 border-t border-cizgi pt-4">
          <div className="flex items-center justify-between">
            <a
              href="https://www.instagram.com/newstopcaferestaurant/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold tracking-tight text-ink hover:underline"
            >
              @newstopcaferestaurant
            </a>
            <a
              href="https://www.instagram.com/newstopcaferestaurant/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-soluk underline underline-offset-4 hover:text-ink"
            >
              <span>Instagram’da takip et</span>
            </a>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <a
              href="https://www.instagram.com/newstopcaferestaurant/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40"
            >
              <Image
                src="/img/latte.webp"
                alt="New Stop Kahve"
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 480px) 30vw, 120px"
              />
            </a>
            <a
              href="https://www.instagram.com/newstopcaferestaurant/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40"
            >
              <Image
                src="/img/blue.webp"
                alt="New Stop İçecek"
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 480px) 30vw, 120px"
              />
            </a>
            <a
              href="https://www.instagram.com/newstopcaferestaurant/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40"
            >
              <Image
                src="/img/trio.webp"
                alt="New Stop Tatlı"
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 480px) 30vw, 120px"
              />
            </a>
          </div>
        </div>
      </div>
    </SayfaKabi>
  );
}
