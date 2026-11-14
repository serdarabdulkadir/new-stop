"use client";
import Image from "next/image";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { SayfaKabi } from "./Sayfa";

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
          <h2 className="text-[36px] font-bold leading-tight tracking-[-0.03em] text-ink">
            new stop?
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-800">
            <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>AÇIĞIZ · 23:30&apos;A KADAR</span>
          </div>
        </div>

        {/* Konsept ve Açıklama */}
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-yuzey/70 p-3.5 border border-cizgi/50">
          <div className="relative size-16 flex-none rounded-xl bg-sari/30 border border-sari/60 p-2.5 flex items-center justify-center shadow-xs">
            <Image
              src="/img/logo.png"
              alt="New Stop"
              width={44}
              height={44}
              className="rounded-full bg-sari object-cover"
            />
          </div>
          <p className="text-[14px] leading-relaxed text-ink/90 font-normal">
            Durağında in, bir kahve molası ver. Karadeniz Teknik Üniversitesi Fatih Kampüsü yanı ve Söğütlü sahilinde New Stop; taze kahveler ve lezzetli tatlılarla senin durağın.
          </p>
        </div>

        {/* Çalışma Saatleri */}
        <div className="mt-5 border-t border-cizgi pt-4">
          <span className="block text-[11px] font-bold tracking-wider text-soluk uppercase">
            SAAT
          </span>
          <p className="mt-1 text-base font-semibold text-ink">
            Her gün 09:00 – 23:30
          </p>
        </div>

        {/* Adres */}
        <div className="mt-4 border-t border-cizgi pt-4">
          <span className="block text-[11px] font-bold tracking-wider text-soluk uppercase">
            ADRES
          </span>
          <p className="mt-1 text-[15px] font-medium leading-snug text-ink">
            Söğütlü Mah. Sahil Cad., Akçaabat / Trabzon
          </p>
        </div>

        {/* Aksiyon Düğmeleri */}
        <div className="mt-5 grid gap-2.5">
          <a
            href="https://www.google.com/maps/search/?api=1&query=New+Stop+Cafe+Söğütlü+Akçaabat+Trabzon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-base font-semibold text-beyaz shadow-xs transition-transform active:scale-[0.98]"
          >
            <span>Yol tarifi al</span>
            <ArrowRight size={18} strokeWidth={2} />
          </a>

          <div className="flex gap-2.5">
            <a
              href="tel:+905550000000"
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-yuzey px-4 py-2.5 text-base font-medium text-ink transition-colors active:bg-cizgi"
            >
              <Phone size={18} strokeWidth={1.75} />
              <span>Ara</span>
            </a>
            <a
              href="https://wa.me/905550000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-yuzey px-4 py-2.5 text-base font-medium text-ink transition-colors active:bg-cizgi"
            >
              <MessageCircle size={18} strokeWidth={1.75} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Sosyal Medya & Fotoğraflar */}
        <div className="mt-6 border-t border-cizgi pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-tight text-ink">
              @newstopcafe
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-soluk uppercase hover:text-ink"
            >
              <span>TAKİP ET</span>
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40">
              <Image
                src="/img/latte.webp"
                alt="New Stop Kahve"
                fill
                className="object-cover"
                sizes="(max-width: 480px) 30vw, 120px"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40">
              <Image
                src="/img/blue.webp"
                alt="New Stop İçecek"
                fill
                className="object-cover"
                sizes="(max-width: 480px) 30vw, 120px"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-yuzey border border-cizgi/40">
              <Image
                src="/img/trio.webp"
                alt="New Stop Tatlı"
                fill
                className="object-cover"
                sizes="(max-width: 480px) 30vw, 120px"
              />
            </div>
          </div>
        </div>
      </div>
    </SayfaKabi>
  );
}
