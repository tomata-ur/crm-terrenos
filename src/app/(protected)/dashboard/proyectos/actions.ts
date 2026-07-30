"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";

export async function createProyecto(formData: FormData) {
  const usuario = await requireUsuario();

  const nombre = formData.get("nombre") as string;
  const comuna = (formData.get("comuna") as string) || null;
  const descripcion = (formData.get("descripcion") as string) || null;
  const esPropio = formData.get("esPropio") === "on";

  await prisma.proyecto.create({
    data: {
      empresaId: usuario.empresaId,
      nombre,
      comuna,
      descripcion,
      esPropio,
      createdById: usuario.id,
    },
  });

  revalidatePath("/dashboard/proyectos");
  redirect("/dashboard/proyectos");
}
