"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import type { EstadoLote } from "@/generated/prisma/enums";

export async function createManzana(formData: FormData) {
  const usuario = await requireUsuario();
  const proyectoId = formData.get("proyectoId") as string;
  const codigo = formData.get("codigo") as string;

  const proyecto = await prisma.proyecto.findFirst({
    where: { id: proyectoId, empresaId: usuario.empresaId },
  });
  if (!proyecto) throw new Error("Proyecto no encontrado");

  await prisma.manzana.create({
    data: { empresaId: usuario.empresaId, proyectoId, codigo },
  });

  revalidatePath(`/dashboard/proyectos/${proyectoId}`);
  redirect(`/dashboard/proyectos/${proyectoId}`);
}

export async function createLote(formData: FormData) {
  const usuario = await requireUsuario();
  const manzanaId = formData.get("manzanaId") as string;
  const numero = formData.get("numero") as string;
  const superficieRaw = formData.get("superficieM2") as string;
  const precioRaw = formData.get("precioLista") as string;

  const manzana = await prisma.manzana.findFirst({
    where: { id: manzanaId, empresaId: usuario.empresaId },
  });
  if (!manzana) throw new Error("Manzana no encontrada");

  await prisma.lote.create({
    data: {
      empresaId: usuario.empresaId,
      manzanaId,
      numero,
      superficieM2: superficieRaw ? Number(superficieRaw) : null,
      precioLista: precioRaw ? Number(precioRaw) : null,
    },
  });

  revalidatePath(`/dashboard/proyectos/${manzana.proyectoId}`);
  redirect(`/dashboard/proyectos/${manzana.proyectoId}`);
}

export async function updateLoteEstado(loteId: string, estado: EstadoLote) {
  const usuario = await requireUsuario();

  const lote = await prisma.lote.findFirst({
    where: { id: loteId, empresaId: usuario.empresaId },
    include: { manzana: true },
  });
  if (!lote) throw new Error("Lote no encontrado");

  await prisma.lote.update({ where: { id: loteId }, data: { estado } });

  revalidatePath(`/dashboard/proyectos/${lote.manzana.proyectoId}`);
}
