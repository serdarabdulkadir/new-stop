"use client";
// Ortak alt sayfa (vaul) parçaları: kaplama, içerik kabı, tutamaç.
import { Drawer } from "vaul";
import type { ReactNode } from "react";

export function SayfaKabi({
  acik,
  kapat,
  baslik,
  tam = false,
  children,
}: {
  acik: boolean;
  kapat: () => void;
  baslik: string;
  tam?: boolean;
  children: ReactNode;
}) {
  return (
    <Drawer.Root open={acik} onOpenChange={(a) => !a && kapat()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/45" />
        <Drawer.Content
          aria-describedby={undefined}
          className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[480px] flex-col rounded-t-3xl bg-zemin outline-none ${
            tam ? "h-[calc(100dvh-12px)]" : "max-h-[92dvh]"
          }`}
        >
          <Drawer.Handle className="mt-2.5! mb-1.5! h-1! w-10! bg-cizgi!" />
          <Drawer.Title className="sr-only">{baslik}</Drawer.Title>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
