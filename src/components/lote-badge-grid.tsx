"use client";

import { useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoteEstadoSelect } from "@/components/lote-estado-select";
import {
  createReserva,
  cancelReserva,
} from "@/app/(protected)/dashboard/proyectos/[id]/actions";
import { cn } from "@/lib/utils";
import type { EstadoLote } from "@/generated/prisma/enums";

type Lote = {
  id: string;
  numero: string;
  superficieM2: string | number | null;
  precioLista: string | number | null;
  estado: EstadoLote;
  reserva: { id: string; leadNombre: string } | null;
};

const ESTADO_COLOR: Record<EstadoLote, string> = {
  disponible:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
  reservado:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300",
  vendido:
    "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300",
};

export function LoteBadgeGrid({
  lotes,
  leads,
}: {
  lotes: Lote[];
  leads: { id: string; nombre: string }[];
}) {
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
            <LoteDetail
              lote={selected}
              leads={leads}
              onChanged={() => setSelected(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function LoteDetail({
  lote,
  leads,
  onChanged,
}: {
  lote: Lote;
  leads: { id: string; nombre: string }[];
  onChanged: () => void;
}) {
  const [leadId, setLeadId] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <SheetHeader>
        <SheetTitle>Lote {lote.numero}</SheetTitle>
        <SheetDescription>
          Detalle, estado y reserva del lote.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4 px-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Superficie</p>
            <p className="font-medium">
              {lote.superficieM2 ? `${lote.superficieM2} m²` : "—"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Precio lista</p>
            <p className="font-medium">
              {lote.precioLista
                ? Number(lote.precioLista).toLocaleString("es-CL")
                : "—"}
            </p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-zinc-500">Estado</p>
          <LoteEstadoSelect loteId={lote.id} estado={lote.estado} />
        </div>

        {lote.estado === "disponible" && (
          <div className="flex flex-col gap-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Reservar para un lead</p>
            {leads.length === 0 ? (
              <p className="text-xs text-zinc-500">
                No hay leads todavía. Crea uno en la sección Leads.
              </p>
            ) : (
              <>
                <Select
                  items={leads.map((l) => ({ value: l.id, label: l.nombre }))}
                  onValueChange={(value) => setLeadId(value as string)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar lead..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  disabled={!leadId || isPending}
                  onClick={() => {
                    if (!leadId) return;
                    startTransition(async () => {
                      await createReserva(lote.id, leadId);
                      onChanged();
                    });
                  }}
                >
                  Reservar
                </Button>
              </>
            )}
          </div>
        )}

        {lote.estado === "reservado" && lote.reserva && (
          <div className="flex flex-col gap-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Reservado para</p>
            <p className="text-sm">{lote.reserva.leadNombre}</p>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                const reservaId = lote.reserva!.id;
                startTransition(async () => {
                  await cancelReserva(reservaId);
                  onChanged();
                });
              }}
            >
              Cancelar reserva
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
