"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateVentaEstado } from "@/app/(protected)/dashboard/ventas/[id]/actions";
import type { EstadoVenta } from "@/generated/prisma/enums";

const ESTADOS: { value: EstadoVenta; label: string }[] = [
  { value: "promesa", label: "Promesa" },
  { value: "escriturada", label: "Escriturada" },
  { value: "anulada", label: "Anulada" },
];

export function VentaEstadoSelect({
  ventaId,
  estado,
}: {
  ventaId: string;
  estado: EstadoVenta;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      items={ESTADOS}
      defaultValue={estado}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          await updateVentaEstado(ventaId, value as EstadoVenta);
        });
      }}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ESTADOS.map((e) => (
          <SelectItem key={e.value} value={e.value}>
            {e.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
