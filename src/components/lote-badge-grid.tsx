"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { LoteEstadoSelect } from "@/components/lote-estado-select";
import { cn } from "@/lib/utils";
import type { EstadoLote } from "@/generated/prisma/enums";

type Lote = {
  id: string;
  numero: string;
  superficieM2: string | number | null;
  precioLista: string | number | null;
  estado: EstadoLote;
};

const ESTADO_COLOR: Record<EstadoLote, string> = {
  disponible:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
  reservado:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300",
  vendido:
    "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300",
};

export function LoteBadgeGrid({ lotes }: { lotes: Lote[] }) {
  const [selected, setSelected] = useState<Lote | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {lotes.map((lote) => (
          <button
            key={lote.id}
            type="button"
            onClick={() => setSelected(lote)}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors",
              ESTADO_COLOR[lote.estado]
            )}
            title={`Lote ${lote.numero} — ${lote.estado}`}
          >
            {lote.numero}
          </button>
        ))}
      </div>

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Lote {selected.numero}</SheetTitle>
                <SheetDescription>
                  Detalle y cambio de estado del lote.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Superficie</p>
                    <p className="font-medium">
                      {selected.superficieM2
                        ? `${selected.superficieM2} m²`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Precio lista</p>
                    <p className="font-medium">
                      {selected.precioLista
                        ? Number(selected.precioLista).toLocaleString("es-CL")
                        : "—"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-zinc-500">Estado</p>
                  <LoteEstadoSelect
                    loteId={selected.id}
                    estado={selected.estado}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
