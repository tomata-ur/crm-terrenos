import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ETAPAS } from "@/lib/pipeline";
import type { EstadoLote } from "@/generated/prisma/enums";

const ESTADO_LOTE_LABEL: Record<EstadoLote, string> = {
  disponible: "Disponibles",
  reservado: "Reservados",
  vendido: "Vendidos",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-normal text-zinc-500">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}

export default async function DashboardHomePage() {
  const usuario = await requireUsuario();

  const now = new Date();
  const inicioMes = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const inicioMesSiguiente = new Date(
    Date.UTC(now.getFullYear(), now.getMonth() + 1, 1)
  );

  const [lotesPorEstado, leadsPorEtapa, cobradoMes, porCobrarMes] =
    await Promise.all([
      prisma.lote.groupBy({
        by: ["estado"],
        where: { empresaId: usuario.empresaId },
        _count: true,
      }),
      prisma.lead.groupBy({
        by: ["estadoPipeline"],
        where: { empresaId: usuario.empresaId },
        _count: true,
      }),
      prisma.cuota.aggregate({
        where: {
          empresaId: usuario.empresaId,
          estado: "pagada",
          fechaPago: { gte: inicioMes, lt: inicioMesSiguiente },
        },
        _sum: { montoPagado: true },
      }),
      prisma.cuota.aggregate({
        where: {
          empresaId: usuario.empresaId,
          estado: { not: "pagada" },
          fechaVencimiento: { gte: inicioMes, lt: inicioMesSiguiente },
        },
        _sum: { monto: true },
      }),
    ]);

  const lotesMap = new Map(lotesPorEstado.map((l) => [l.estado, l._count]));
  const leadsMap = new Map(
    leadsPorEtapa.map((l) => [l.estadoPipeline, l._count])
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Inicio</h1>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Lotes</h2>
        <div className="flex flex-wrap gap-4">
          {(["disponible", "reservado", "vendido"] as EstadoLote[]).map(
            (estado) => (
              <StatCard
                key={estado}
                label={ESTADO_LOTE_LABEL[estado]}
                value={lotesMap.get(estado) ?? 0}
              />
            )
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Cobros del mes</h2>
        <div className="flex flex-wrap gap-4">
          <StatCard
            label="Cobrado"
            value={(cobradoMes._sum.montoPagado
              ? Number(cobradoMes._sum.montoPagado)
              : 0
            ).toLocaleString("es-CL")}
          />
          <StatCard
            label="Por cobrar"
            value={(porCobrarMes._sum.monto
              ? Number(porCobrarMes._sum.monto)
              : 0
            ).toLocaleString("es-CL")}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Leads por etapa</h2>
        <div className="flex flex-wrap gap-4">
          {ETAPAS.map((etapa) => (
            <StatCard
              key={etapa.value}
              label={etapa.label}
              value={leadsMap.get(etapa.value) ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
