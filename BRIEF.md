# Newstop QR Menü — Brief

**Mekân:** New Stop Cafe & Restaurant, Söğütlü / Akçaabat (KTÜ Fatih kampüsü yanı). 09:00–23:30. Kitle: öğrenci + Arap turist (mevcut menü TR/EN/AR).
**Kimlik (gerçek mekândan):** sarı yuvarlak logo + siyah fincan, tuğla duvar, turuncu neon "NEW STOP" tabelası, sarı sandalyeler, damalı zemin.
**Sorun (yorumlar):** yavaş servis, sırası karışan siparişler.

## KARAR (2026-11-14): v2 geliştirilerek kullanılacak → v2+
Kullanıcı v3/v4/v5'i eledi (v5 "AI slop"). Çalışan prototip: https://claude.ai/artifact/DtzbZmUWEvttxVCkPUQbm9 — kaynak `prototip/v2plus.tpl.html` (+ `imgs.json`, `%%IMG:x%%` yer tutucuları), derlenmiş `prototip/newstop-v2plus.html`.
v2+ ekleri: hareketli kategori ikonları (kahve dumanı, buz, kar, inci, kabarcık, kiraz), "+" → Seçtiklerim'e uçan nokta + sayaç zıplaması + tık sesi + 8ms titreşim, STOP zil sesi, "Doğrudan menüye geç" (bir kez geçen açılışı görmez), şuruplu ürünlerde "+" ürün sayfasını açar, sessize alma hatırlanır, liste 30 dk localStorage, Garsona göster tam ekran sarı + wake lock, reduced-motion'da hareket yok.
Karar sayfası (5 yön + uzman puanları): https://claude.ai/artifact/FzeL7zPgkrByB7d5nMuUdB (`prototip/karar-sayfasi.html`).

## v2 "İnecek var!" (2026-11-14)
Kafe, Permesso'nun beğenilen referansını (permesso-menu.vercel.app) sevdi: sakin, okunaklı, tek bir sevimli etkileşim. Buna göre:
- Açılış: otobüs STOP düğmesi çizimi, "inecek var!" (dolmuş kültürü), düğmeye basınca menü. İmza yalnız burada.
- Menü: açık zemin, logo sarı-siyahı; "bugün durakta" vitrin, kategori hapları, sade liste (foto yalnız gerçek fotoğraf varsa), alttan ürün sayfası.
- **Sipariş/takip hizmeti YOK.** Yalnız "Seçtiklerime ekle" → "Garsona göster" (sarı tam ekran, ekran açık kalır). Liste yalnız telefonda (localStorage) 30 dk tutulur.
- Figma sayfası "v2 · İnecek var (sade)". v1 sayfası yalnız arşiv; v1'deki sipariş hattı geçersiz.

## Alternatif: v3 "Işığı aç" (neon, 2026-11-14)
Figma sayfası "v3 · Işığı aç (neon)". Koyu duvar, sönük "NEW STOP" neonu, ışık anahtarına basınca yanar. Kategoriler neon tabela (seçili yanar, diğerleri sönük tüp). Kokteyl/içecekler 2 sütun fotoğraf ızgarası (kafenin kendi neon ışıklı çekimleri). Tek neon renk: tabeladaki turuncu. Sipariş yok; Garsona göster + 30 dk liste aynı.
Not: kokteyl fotoğrafı–ürün adı eşleşmeleri tahmini (Elma Mojito, Berry Hibiscus, Cool Lime), kafeye teyit ettirilecek.

## Eski konsept: Kalkış Panosu (v1, arşiv)
"Stop" = durak. Menü bir istasyon kalkış panosu:
- Kategoriler = seferler (hat kodu K1, K2, B1…), harfler split-flap kapaklarda döner; dil TR/EN/AR panoda sırayla çevrilir.
- Ürün = sefer satırı; seçilenler **bilete** eklenir, garsona bilet gösterilir.
- **Sipariş hattı:** Alındı → Hazırlanıyor → Yolda → Masada + tahmini dakika (yavaş servis şikâyetine doğrudan yanıt).
- "Bugünün seferi" öne çıkan ürün, öğrenci saati.

## Figma
https://www.figma.com/design/kqsCNL56897MP0kKKPEuN3
Sayfa "Newstop · Kalkış Panosu": 01 Açılış panosu, 02 Hat K2 Soğuk Kahveler, 03 Ürün Ice Mocha, 04 Biletim + sipariş hattı. Bileşenler: Pano Harfi (5 varyant), Ürün Satırı, Çip. Renkler `Newstop` değişken koleksiyonunda.
Yazı: Big Shoulders Display (pano), Familjen Grotesk (metin), Martian Mono (kod/etiket), Noto Sans Arabic.

## Veri
`referans/onepage.txt` — tüm menü (≈150 ürün, fiyatlar 06.10.2026). `referans/dm` kategori kapakları + logo, `referans/rn` mekân/ürün fotoğrafları (kafenin kendi çekimleri), `referans/kontak.jpg` hepsinin özeti.
