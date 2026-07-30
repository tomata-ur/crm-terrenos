import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { FORMA_PAGO_LABEL, ESTADO_VENTA_LABEL } from "@/lib/venta-labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function VentasPage() {
  const usuario = await requireUsuario();

  const ventas = await prisma.venta.findMany({
    where: { empresaId: usuario.empresaId },
    include: {
      cliente: true,
      lote: { include: { manzana: { include: { proyecto: true } } } },
    },
    orderBy: { fechaVenta: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Ventas</h1>

      {ventas.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Todavía no hay ventas. Se crean convirtiendo una reserva desde el
          detalle de un proyecto.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Proyecto / Lote</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Forma de pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventas.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/ventas/${v.id}`}
                    className="font-medium hover:underline"
                  >
                    {v.cliente.nombre}
                  </Link>
                </TableCell>
                <TableCell>
                  {v.lote.manzana.proyecto.nombre} — Lote {v.lote.numero}
                </TableCell>
                <TableCell>
                  {Number(v.precioVenta).toLocaleString("es-CL")}
                </TableCell>
                <TableCell>{FORMA_PAGO_LABEL[v.formaPago]}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {ESTADO_VENTA_LABEL[v.estado]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
