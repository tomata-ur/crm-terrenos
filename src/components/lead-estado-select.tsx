"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLeadEstado } from "@/app/(protected)/dashboard/leads/actions";
import { ETAPAS } from "@/lib/pipeline";
import type { EstadoPipeline } from "@/generated/prisma/enums";

export function LeadEstadoSelect({
  leadId,
  estado,
}: {
  leadId: string;
  estado: EstadoPipeline;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      items={ETAPAS}
      defaultValue={estado}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          await updateLeadEstado(leadId, value as EstadoPipeline);
        });
      }}
    >
      <SelectTrigger size="sm" className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ETAPAS.map((e) => (
          <SelectItem key={e.value} value={e.value}>
            {e.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
