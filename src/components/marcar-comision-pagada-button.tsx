"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { marcarComisionPagada } from "@/app/(protected)/dashboard/ventas/[id]/actions";

export function MarcarComisionPagadaButton({
  comisionId,
}: {
  comisionId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => marcarComisionPagada(comisionId))}
    >
      Marcar pagada
    </Button>
  );
}
