import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { VentaEstadoSelect } from "@/components/venta-estado-select";
import { NewPlanPagoForm } from "@/components/new-plan-pago-form";
import { MarcarCuotaPagadaButton } from "@/components/marcar-cuota-pagada-button";
import { FORMA_PAGO_LABEL } from "@/lib/venta-labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      planPago: { include: { cuotas: { orderBy: { numero: "asc" } } } },
    },
  });

  if (!venta) notFound();

  const hoy = new Date();

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

      <div>
        <h2 className="mb-3 text-lg font-medium">Plan de pago</h2>
        {!venta.planPago ? (
          <NewPlanPagoForm
            ventaId={venta.id}
            precioVenta={Number(venta.precioVenta)}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {venta.planPago.numCuotas} cuotas ·{" "}
              {Number(venta.planPago.montoTotal).toLocaleString("es-CL")}{" "}
              total
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venta.planPago.cuotas.map((cuota) => {
                  const atrasada =
                    cuota.estado === "pendiente" &&
                    cuota.fechaVencimiento < hoy;
                  return (
                    <TableRow key={cuota.id}>
                      <TableCell>{cuota.numero}</TableCell>
                      <TableCell>
                        {cuota.fechaVencimiento.toLocaleDateString("es-CL", {
                          timeZone: "UTC",
                        })}
                      </TableCell>
                      <TableCell>
                        {Number(cuota.monto).toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {cuota.estado === "pagada" ? (
                          <Badge variant="secondary">Pagada</Badge>
                        ) : atrasada ? (
                          <Badge variant="destructive">Atrasada</Badge>
                        ) : (
                          <Badge variant="outline">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {cuota.estado !== "pagada" && (
                          <MarcarCuotaPagadaButton cuotaId={cuota.id} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
