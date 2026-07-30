import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { NewManzanaDialog } from "@/components/new-manzana-dialog";
import { NewLoteDialog } from "@/components/new-lote-dialog";
import { LoteEstadoSelect } from "@/components/lote-estado-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProyectoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await requireUsuario();

  const proyecto = await prisma.proyecto.findFirst({
    where: { id, empresaId: usuario.empresaId },
    include: {
      manzanas: {
        orderBy: { orden: "asc" },
        include: { lotes: { orderBy: { numero: "asc" } } },
      },
    },
  });

  if (!proyecto) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">{proyecto.nombre}</h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          {proyecto.comuna ?? "Sin comuna"}
          <Badge variant={proyecto.esPropio ? "default" : "secondary"}>
            {proyecto.esPropio ? "Propio" : "Corretaje"}
          </Badge>
        </p>
        {proyecto.descripcion && (
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {proyecto.descripcion}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Manzanas y lotes</h2>
        <NewManzanaDialog proyectoId={proyecto.id} />
      </div>

      {proyecto.manzanas.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Todavía no hay manzanas. Agrega la primera arriba.
        </p>
      ) : (
        proyecto.manzanas.map((manzana) => (
          <div key={manzana.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Manzana {manzana.codigo}</h3>
              <NewLoteDialog manzanaId={manzana.id} />
            </div>
            {manzana.lotes.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin lotes todavía.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Superficie (m²)</TableHead>
                    <TableHead>Precio lista</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manzana.lotes.map((lote) => (
                    <TableRow key={lote.id}>
                      <TableCell>{lote.numero}</TableCell>
                      <TableCell>
                        {lote.superficieM2?.toString() ?? "—"}
                      </TableCell>
                      <TableCell>
                        {lote.precioLista
                          ? Number(lote.precioLista).toLocaleString("es-CL")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <LoteEstadoSelect loteId={lote.id} estado={lote.estado} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        ))
      )}
    </div>
  );
}
