"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLote } from "@/app/(protected)/dashboard/proyectos/[id]/actions";

export function NewLoteDialog({ manzanaId }: { manzanaId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Agregar lote
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo lote</DialogTitle>
        </DialogHeader>
        <form action={createLote} className="flex flex-col gap-4">
          <input type="hidden" name="manzanaId" value={manzanaId} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" name="numero" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="superficieM2">Superficie (m²)</Label>
            <Input id="superficieM2" name="superficieM2" type="number" step="0.01" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="precioLista">Precio lista</Label>
            <Input id="precioLista" name="precioLista" type="number" step="1" />
          </div>
          <Button type="submit">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
