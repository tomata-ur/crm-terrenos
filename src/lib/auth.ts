import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Devuelve el Usuario (con su empresa) para la sesión de Supabase actual,
 * o null si no hay sesión. La primera vez que un authUserId de Supabase
 * inicia sesión sin tener fila en `usuarios`, se crea (junto con la
 * empresa, si todavía no existe ninguna) con rol admin — MVP de un solo
 * tenant, sin flujo de invitación/signup propio todavía.
 */
export async function getCurrentUsuario() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const existing = await prisma.usuario.findUnique({
    where: { authUserId: user.id },
    include: { empresa: true },
  });

  if (existing) return existing;

  let empresa = await prisma.empresa.findFirst();
  if (!empresa) {
    empresa = await prisma.empresa.create({ data: { nombre: "Mi empresa" } });
  }

  return prisma.usuario.create({
    data: {
      empresaId: empresa.id,
      authUserId: user.id,
      email: user.email!,
      nombre: user.user_metadata?.full_name ?? user.email!,
      rol: "admin",
    },
    include: { empresa: true },
  });
}

/**
 * Igual que getCurrentUsuario(), pero lanza si no hay sesión. Server
 * Actions son alcanzables por POST directo (no solo desde la UI), así que
 * cada una debe verificar auth por su cuenta en vez de confiar en que el
 * layout ya lo hizo.
 */
export async function requireUsuario() {
  const usuario = await getCurrentUsuario();
  if (!usuario) {
    throw new Error("No autenticado");
  }
  return usuario;
}
