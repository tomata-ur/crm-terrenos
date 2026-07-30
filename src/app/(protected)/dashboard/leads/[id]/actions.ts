"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import type { TipoSeguimiento } from "@/generated/prisma/enums";

export async function createSeguimiento(formData: FormData) {
  const usuario = await requireUsuario();

  const leadId = formData.get("leadId") as string;
  const tipo = formData.get("tipo") as TipoSeguimiento;
  const nota = (formData.get("nota") as string) || null;
  const proximoRaw = formData.get("proximoSeguimiento") as string;

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, empresaId: usuario.empresaId },
  });
  if (!lead) throw new Error("Lead no encontrado");

  await prisma.seguimiento.create({
    data: {
      empresaId: usuario.empresaId,
      leadId,
      usuarioId: usuario.id,
      tipo,
      nota,
      proximoSeguimiento: proximoRaw ? new Date(proximoRaw) : null,
    },
  });

  revalidatePath(`/dashboard/leads/${leadId}`);
}
