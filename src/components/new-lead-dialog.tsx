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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLead } from "@/app/(protected)/dashboard/leads/actions";

const CATEGORIAS = [
  { value: "comunidad", label: "Comunidad / grupo" },
  { value: "individual_credito", label: "Individual con crédito bancario" },
  { value: "contado_pie_alto", label: "Contado / pie alto" },
];

const CAPACIDADES_CREDITO = [
  { value: "pre_aprobado", label: "Pre-aprobado" },
  { value: "por_evaluar", label: "Por evaluar" },
  { value: "rechazado", label: "Rechazado" },
];

const PLAZOS = [
  { value: "inmediato", label: "Inmediato" },
  { value: "tres_meses", label: "3 meses" },
  { value: "seis_meses", label: "6 meses" },
  { value: "mas_de_seis_meses", label: "+6 meses" },
];

export function NewLeadDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Nuevo lead</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo lead</DialogTitle>
        </DialogHeader>
        <form action={createLead} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
            <Input
              id="telefono"
              name="telefono"
              placeholder="+56 9 1234 5678"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select name="categoria" items={CATEGORIAS}>
              <SelectTrigger id="categoria" className="w-full">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacidadCredito">Capacidad de crédito</Label>
            <Select name="capacidadCredito" items={CAPACIDADES_CREDITO}>
              <SelectTrigger id="capacidadCredito" className="w-full">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {CAPACIDADES_CREDITO.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="plazoEstimado">Plazo estimado</Label>
            <Select name="plazoEstimado" items={PLAZOS}>
              <SelectTrigger id="plazoEstimado" className="w-full">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {PLAZOS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pieDisponible">Pie disponible</Label>
            <Input
              id="pieDisponible"
              name="pieDisponible"
              type="number"
              step="1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fuente">Fuente</Label>
            <Input id="fuente" name="fuente" defaultValue="whatsapp" />
          </div>
          <Button type="submit">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
