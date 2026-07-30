"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import type { EstadoLote, FormaPago } from "@/generated/prisma/enums";

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

export async function createReserva(loteId: string, leadId: string) {
  const usuario = await requireUsuario();

  const lote = await prisma.lote.findFirst({
    where: { id: loteId, empresaId: usuario.empresaId },
    include: { manzana: true },
  });
  if (!lote) throw new Error("Lote no encontrado");
  if (lote.estado !== "disponible") {
    throw new Error("El lote no está disponible");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, empresaId: usuario.empresaId },
  });
  if (!lead) throw new Error("Lead no encontrado");

  await prisma.$transaction([
    prisma.reserva.create({
      data: {
        empresaId: usuario.empresaId,
        loteId,
        leadId,
        usuarioId: usuario.id,
        estado: "activa",
      },
    }),
    prisma.lote.update({ where: { id: loteId }, data: { estado: "reservado" } }),
  ]);

  revalidatePath(`/dashboard/proyectos/${lote.manzana.proyectoId}`);
}

export async function cancelReserva(reservaId: string) {
  const usuario = await requireUsuario();

  const reserva = await prisma.reserva.findFirst({
    where: { id: reservaId, empresaId: usuario.empresaId },
    include: { lote: { include: { manzana: true } } },
  });
  if (!reserva) throw new Error("Reserva no encontrada");

  await prisma.$transaction([
    prisma.reserva.update({
      where: { id: reservaId },
      data: { estado: "cancelada" },
    }),
    prisma.lote.update({
      where: { id: reserva.loteId },
      data: { estado: "disponible" },
    }),
  ]);

  revalidatePath(`/dashboard/proyectos/${reserva.lote.manzana.proyectoId}`);
}

export async function createVenta(
  reservaId: string,
  precioVenta: number,
  formaPago: FormaPago
) {
  const usuario = await requireUsuario();

  const reserva = await prisma.reserva.findFirst({
    where: { id: reservaId, empresaId: usuario.empresaId, estado: "activa" },
    include: { lote: { include: { manzana: true } }, lead: true },
  });
  if (!reserva) throw new Error("Reserva no encontrada o no activa");

  let cliente = await prisma.cliente.findUnique({
    where: { leadId: reserva.leadId },
  });
  if (!cliente) {
    cliente = await prisma.cliente.create({
      data: {
        empresaId: usuario.empresaId,
        leadId: reserva.leadId,
        nombre: reserva.lead.nombre,
        telefono: reserva.lead.telefono,
        email: reserva.lead.email,
      },
    });
  }

  const [venta] = await prisma.$transaction([
    prisma.venta.create({
      data: {
        empresaId: usuario.empresaId,
        loteId: reserva.loteId,
        clienteId: cliente.id,
        reservaId: reserva.id,
        precioVenta,
        formaPago,
        usuarioId: usuario.id,
        estado: "promesa",
      },
    }),
    prisma.reserva.update({
      where: { id: reserva.id },
      data: { estado: "convertida" },
    }),
    prisma.lote.update({
      where: { id: reserva.loteId },
      data: { estado: "vendido" },
    }),
  ]);

  revalidatePath(`/dashboard/proyectos/${reserva.lote.manzana.proyectoId}`);
  revalidatePath("/dashboard/ventas");

  return venta.id;
}
