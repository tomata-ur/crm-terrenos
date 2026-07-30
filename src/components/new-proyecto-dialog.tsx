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
import { Textarea } from "@/components/ui/textarea";
import { createProyecto } from "@/app/(protected)/dashboard/proyectos/actions";

export function NewProyectoDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Nuevo proyecto</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo proyecto</DialogTitle>
        </DialogHeader>
        <form action={createProyecto} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="comuna">Comuna</Label>
            <Input id="comuna" name="comuna" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="esPropio"
              defaultChecked
              className="h-4 w-4"
            />
            Proyecto propio (desmarcar si es corretaje de terceros)
          </label>
          <Button type="submit">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
