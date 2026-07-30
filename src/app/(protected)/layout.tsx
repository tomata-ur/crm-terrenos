import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUsuario } from "@/lib/auth";
import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/proyectos", label: "Proyectos" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/ventas", label: "Ventas" },
  { href: "/dashboard/comisiones", label: "Comisiones" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getCurrentUsuario();

  if (!usuario) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r bg-zinc-50 p-4 dark:bg-zinc-950">
        <div>
          <p className="mb-6 text-lg font-semibold">CRM Terrenos</p>
          <nav className="flex flex-col gap-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t pt-4">
          <p className="mb-2 truncate text-xs text-zinc-500">
            {usuario.email}
          </p>
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit" className="w-full">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
