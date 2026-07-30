import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { VentaEstadoSelect } from "@/components/venta-estado-select";
import { FORMA_PAGO_LABEL } from "@/lib/venta-labels";

export default async function VentaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await requireUsuario();

  const venta = await prisma.venta.findFirst({
    where: { id, empresaId: usuario.empresaId },
    include: {
      cliente: true,
      lote: { include: { manzana: { include: { proyecto: true } } } },
      usuario: true,
    },
  });

  if (!venta) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">{venta.cliente.nombre}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            href={`/dashboard/proyectos/${venta.lote.manzana.proyecto.id}`}
            className="hover:underline"
          >
            {venta.lote.manzana.proyecto.nombre}
          </Link>{" "}
          — Manzana {venta.lote.manzana.codigo}, Lote {venta.lote.numero}
        </p>

        <div className="mt-4 flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-zinc-500">Estado</p>
            <div className="mt-1">
              <VentaEstadoSelect ventaId={venta.id} estado={venta.estado} />
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Precio de venta</p>
            <p className="mt-1.5 text-sm font-medium">
              {Number(venta.precioVenta).toLocaleString("es-CL")}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Forma de pago</p>
            <p className="mt-1.5 text-sm font-medium">
              {FORMA_PAGO_LABEL[venta.formaPago]}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Vendedor</p>
            <p className="mt-1.5 text-sm font-medium">
              {venta.usuario?.nombre ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
