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
import { createManzana } from "@/app/(protected)/dashboard/proyectos/[id]/actions";

export function NewManzanaDialog({ proyectoId }: { proyectoId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Agregar manzana
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva manzana</DialogTitle>
        </DialogHeader>
        <form action={createManzana} className="flex flex-col gap-4">
          <input type="hidden" name="proyectoId" value={proyectoId} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="codigo">Código</Label>
            <Input id="codigo" name="codigo" placeholder="Ej: A, B, 1..." required />
          </div>
          <Button type="submit">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
