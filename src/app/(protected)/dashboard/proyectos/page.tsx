import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { NewProyectoDialog } from "@/components/new-proyecto-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProyectosPage() {
  const usuario = await requireUsuario();

  const proyectos = await prisma.proyecto.findMany({
    where: { empresaId: usuario.empresaId },
    include: { manzanas: { include: { lotes: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <NewProyectoDialog />
      </div>

      {proyectos.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Todavía no hay proyectos. Crea el primero con el botón de arriba.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Comuna</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Lotes</TableHead>
              <TableHead>Disponibles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proyectos.map((p) => {
              const lotes = p.manzanas.flatMap((m) => m.lotes);
              const disponibles = lotes.filter(
                (l) => l.estado === "disponible"
              ).length;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/proyectos/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{p.comuna ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={p.esPropio ? "default" : "secondary"}>
                      {p.esPropio ? "Propio" : "Corretaje"}
                    </Badge>
                  </TableCell>
                  <TableCell>{lotes.length}</TableCell>
                  <TableCell>{disponibles}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
