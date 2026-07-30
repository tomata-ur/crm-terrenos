"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import type {
  CategoriaLead,
  CapacidadCredito,
  PlazoEstimado,
  EstadoPipeline,
} from "@/generated/prisma/enums";

function optionalDecimal(value: FormDataEntryValue | null) {
  const str = value as string;
  return str ? Number(str) : null;
}

function optionalEnum<T extends string>(value: FormDataEntryValue | null) {
  const str = value as string;
  return (str || null) as T | null;
}

export async function createLead(formData: FormData) {
  const usuario = await requireUsuario();

  const nombre = formData.get("nombre") as string;
  const telefono = (formData.get("telefono") as string) || null;
  const email = (formData.get("email") as string) || null;
  const fuente = (formData.get("fuente") as string) || "whatsapp";
  const categoria = optionalEnum<CategoriaLead>(formData.get("categoria"));
  const capacidadCredito = optionalEnum<CapacidadCredito>(
    formData.get("capacidadCredito")
  );
  const plazoEstimado = optionalEnum<PlazoEstimado>(
    formData.get("plazoEstimado")
  );
  const pieDisponible = optionalDecimal(formData.get("pieDisponible"));

  await prisma.lead.create({
    data: {
      empresaId: usuario.empresaId,
      nombre,
      telefono,
      email,
      fuente,
      categoria,
      capacidadCredito,
      plazoEstimado,
      pieDisponible,
      createdById: usuario.id,
    },
  });

  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");
}

export async function updateLeadEstado(
  leadId: string,
  estado: EstadoPipeline
) {
  const usuario = await requireUsuario();

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, empresaId: usuario.empresaId },
  });
  if (!lead) throw new Error("Lead no encontrado");

  await prisma.lead.update({ where: { id: leadId }, data: { estadoPipeline: estado } });

  revalidatePath("/dashboard/leads");
}
