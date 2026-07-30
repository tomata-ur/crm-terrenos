import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { NewManzanaDialog } from "@/components/new-manzana-dialog";
import { NewLoteDialog } from "@/components/new-lote-dialog";
import { LoteBadgeGrid } from "@/components/lote-badge-grid";

const LEYENDA = [
  { label: "Disponible", className: "bg-emerald-100 dark:bg-emerald-900/40" },
  { label: "Reservado", className: "bg-amber-100 dark:bg-amber-900/40" },
  { label: "Vendido", className: "bg-rose-100 dark:bg-rose-900/40" },
];

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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium">Manzanas y lotes</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {LEYENDA.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span
                  className={`h-3 w-3 rounded-sm ${item.className}`}
                  aria-hidden
                />
                {item.label}
              </span>
            ))}
          </div>
          <NewManzanaDialog proyectoId={proyecto.id} />
        </div>
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
              <LoteBadgeGrid
                lotes={manzana.lotes.map((l) => ({
                  id: l.id,
                  numero: l.numero,
                  superficieM2: l.superficieM2?.toString() ?? null,
                  precioLista: l.precioLista?.toString() ?? null,
                  estado: l.estado,
                }))}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
