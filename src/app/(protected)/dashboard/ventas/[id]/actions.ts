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
