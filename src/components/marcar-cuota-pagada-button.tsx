"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { marcarCuotaPagada } from "@/app/(protected)/dashboard/ventas/[id]/actions";

export function MarcarCuotaPagadaButton({ cuotaId }: { cuotaId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => marcarCuotaPagada(cuotaId))}
    >
      Marcar pagada
    </Button>
  );
}
