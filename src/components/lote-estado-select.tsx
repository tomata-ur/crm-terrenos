"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLoteEstado } from "@/app/(protected)/dashboard/proyectos/[id]/actions";
import type { EstadoLote } from "@/generated/prisma/enums";

const ESTADOS: { value: EstadoLote; label: string }[] = [
  { value: "disponible", label: "Disponible" },
  { value: "reservado", label: "Reservado" },
  { value: "vendido", label: "Vendido" },
];

export function LoteEstadoSelect({
  loteId,
  estado,
}: {
  loteId: string;
  estado: EstadoLote;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={estado}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          await updateLoteEstado(loteId, value as EstadoLote);
        });
      }}
    >
      <SelectTrigger className="w-36">
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
