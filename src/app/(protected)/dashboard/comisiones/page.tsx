import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ComisionesPage() {
  const usuario = await requireUsuario();

  const comisiones = await prisma.comision.findMany({
    where: { empresaId: usuario.empresaId },
    include: {
      usuario: true,
      venta: { include: { cliente: true } },
    },
    orderBy: { id: "desc" },
  });

  const porVendedor = new Map<
    string,
    { nombre: string; pendiente: number; pagado: number }
  >();
  for (const c of comisiones) {
    const entry = porVendedor.get(c.usuarioId) ?? {
      nombre: c.usuario.nombre,
      pendiente: 0,
      pagado: 0,
    };
    if (c.estado === "pagada") {
      entry.pagado += Number(c.monto);
    } else {
      entry.pendiente += Number(c.monto);
    }
    porVendedor.set(c.usuarioId, entry);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Comisiones</h1>

      {comisiones.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Todavía no hay comisiones. Se generan desde el detalle de cada
          venta.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-3 text-lg font-medium">Por corredor</h2>
            <div className="flex flex-wrap gap-4">
              {[...porVendedor.values()].map((v) => (
                <div key={v.nombre} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{v.nombre}</p>
                  <p className="text-zinc-500">
                    Pendiente: {v.pendiente.toLocaleString("es-CL")}
                  </p>
                  <p className="text-zinc-500">
                    Pagado: {v.pagado.toLocaleString("es-CL")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-medium">Detalle</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Corredor</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>%</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comisiones.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.usuario.nombre}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/ventas/${c.ventaId}`}
                        className="hover:underline"
                      >
                        {c.venta.cliente.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>{c.porcentaje.toString()}%</TableCell>
                    <TableCell>
                      {Number(c.monto).toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.estado === "pagada" ? "secondary" : "outline"
                        }
                      >
                        {c.estado === "pagada" ? "Pagada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
