"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPlanPago } from "@/app/(protected)/dashboard/ventas/[id]/actions";

export function NewPlanPagoForm({
  ventaId,
  precioVenta,
}: {
  ventaId: string;
  precioVenta: number;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={createPlanPago} className="flex flex-col gap-4">
      <input type="hidden" name="ventaId" value={ventaId} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="montoTotal">Monto total a financiar</Label>
        <Input
          id="montoTotal"
          name="montoTotal"
          type="number"
          defaultValue={precioVenta}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="numCuotas">Número de cuotas</Label>
        <Input
          id="numCuotas"
          name="numCuotas"
          type="number"
          defaultValue={12}
          min={1}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fechaInicio">Fecha de la primera cuota</Label>
        <Input
          id="fechaInicio"
          name="fechaInicio"
          type="date"
          defaultValue={today}
          required
        />
      </div>
      <Button type="submit" className="w-fit">
        Generar plan de pago
      </Button>
    </form>
  );
}
