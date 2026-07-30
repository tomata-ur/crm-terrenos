"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import type { EstadoVenta } from "@/generated/prisma/enums";

export async function updateVentaEstado(ventaId: string, estado: EstadoVenta) {
  const usuario = await requireUsuario();

  const venta = await prisma.venta.findFirst({
    where: { id: ventaId, empresaId: usuario.empresaId },
  });
  if (!venta) throw new Error("Venta no encontrada");

  await prisma.venta.update({ where: { id: ventaId }, data: { estado } });

  revalidatePath(`/dashboard/ventas/${ventaId}`);
  revalidatePath("/dashboard/ventas");
}

export async function createPlanPago(formData: FormData) {
  const usuario = await requireUsuario();
  const ventaId = formData.get("ventaId") as string;
  const montoTotal = Number(formData.get("montoTotal"));
  const numCuotas = Number(formData.get("numCuotas"));
  const fechaInicioRaw = formData.get("fechaInicio") as string;

  const venta = await prisma.venta.findFirst({
    where: { id: ventaId, empresaId: usuario.empresaId },
  });
  if (!venta) throw new Error("Venta no encontrada");
  if (!montoTotal || !numCuotas || !fechaInicioRaw) {
    throw new Error("Faltan datos para generar el plan de pago");
  }

  const fechaInicio = new Date(fechaInicioRaw);
  const montoBase = Math.floor(montoTotal / numCuotas);
  const resto = montoTotal - montoBase * numCuotas;

  const planPago = await prisma.planPago.create({
    data: {
      empresaId: usuario.empresaId,
      ventaId,
      montoTotal,
      numCuotas,
      fechaInicio,
    },
  });

  await prisma.cuota.createMany({
    data: Array.from({ length: numCuotas }).map((_, i) => {
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setUTCMonth(fechaVencimiento.getUTCMonth() + i);
      return {
        empresaId: usuario.empresaId,
        planPagoId: planPago.id,
        numero: i + 1,
        monto: i === numCuotas - 1 ? montoBase + resto : montoBase,
        fechaVencimiento,
      };
    }),
  });

  revalidatePath(`/dashboard/ventas/${ventaId}`);
}

export async function marcarCuotaPagada(cuotaId: string) {
  const usuario = await requireUsuario();

  const cuota = await prisma.cuota.findFirst({
    where: { id: cuotaId, empresaId: usuario.empresaId },
    include: { planPago: true },
  });
  if (!cuota) throw new Error("Cuota no encontrada");

  await prisma.cuota.update({
    where: { id: cuotaId },
    data: {
      estado: "pagada",
      fechaPago: new Date(),
      montoPagado: cuota.monto,
    },
  });

  revalidatePath(`/dashboard/ventas/${cuota.planPago.ventaId}`);
}
