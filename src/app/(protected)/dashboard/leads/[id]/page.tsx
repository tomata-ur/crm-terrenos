import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadEstadoSelect } from "@/components/lead-estado-select";
import { toWhatsappLink } from "@/lib/whatsapp";
import {
  CATEGORIA_LABEL,
  CAPACIDAD_CREDITO_LABEL,
  PLAZO_LABEL,
  TIPO_SEGUIMIENTO_LABEL,
} from "@/lib/lead-labels";
import { createSeguimiento } from "./actions";

const TIPOS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada" },
  { value: "email", label: "Email" },
  { value: "visita", label: "Visita" },
];

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await requireUsuario();

  const lead = await prisma.lead.findFirst({
    where: { id, empresaId: usuario.empresaId },
    include: {
      seguimientos: { orderBy: { fecha: "desc" } },
    },
  });

  if (!lead) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">{lead.nombre}</h1>
          {lead.telefono && (
            <a
              href={toWhatsappLink(lead.telefono)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                Continuar en WhatsApp
              </Button>
            </a>
          )}
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {[lead.telefono, lead.email].filter(Boolean).join(" · ") || "Sin datos de contacto"}
        </p>

        <div className="mt-4 flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-zinc-500">Etapa</p>
            <div className="mt-1 w-48">
              <LeadEstadoSelect leadId={lead.id} estado={lead.estadoPipeline} />
            </div>
          </div>
          {lead.categoria && (
            <div>
              <p className="text-xs text-zinc-500">Categoría</p>
              <Badge variant="outline" className="mt-1.5">
                {CATEGORIA_LABEL[lead.categoria]}
              </Badge>
            </div>
          )}
          {lead.capacidadCredito && (
            <div>
              <p className="text-xs text-zinc-500">Capacidad de crédito</p>
              <Badge variant="outline" className="mt-1.5">
                {CAPACIDAD_CREDITO_LABEL[lead.capacidadCredito]}
              </Badge>
            </div>
          )}
          {lead.plazoEstimado && (
            <div>
              <p className="text-xs text-zinc-500">Plazo estimado</p>
              <Badge variant="outline" className="mt-1.5">
                {PLAZO_LABEL[lead.plazoEstimado]}
              </Badge>
            </div>
          )}
          {lead.pieDisponible && (
            <div>
              <p className="text-xs text-zinc-500">Pie disponible</p>
              <p className="mt-1.5 text-sm font-medium">
                {Number(lead.pieDisponible).toLocaleString("es-CL")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Nuevo seguimiento</h2>
        <form action={createSeguimiento} className="flex flex-col gap-4">
          <input type="hidden" name="leadId" value={lead.id} />
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select name="tipo" items={TIPOS} defaultValue="whatsapp">
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="proximoSeguimiento">Próximo seguimiento</Label>
              <Input
                id="proximoSeguimiento"
                name="proximoSeguimiento"
                type="date"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nota">Nota</Label>
            <Textarea
              id="nota"
              name="nota"
              placeholder="Qué se conversó..."
            />
          </div>
          <Button type="submit" className="w-fit">
            Registrar
          </Button>
        </form>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Timeline</h2>
        {lead.seguimientos.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Todavía no hay seguimientos registrados.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {lead.seguimientos.map((s) => (
              <div key={s.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {TIPO_SEGUIMIENTO_LABEL[s.tipo]}
                  </Badge>
                  <span className="text-xs text-zinc-500">
                    {s.fecha.toLocaleString("es-CL")}
                  </span>
                </div>
                {s.nota && <p className="mt-2">{s.nota}</p>}
                {s.proximoSeguimiento && (
                  <p className="mt-2 text-xs text-amber-600">
                    Próximo seguimiento:{" "}
                    {s.proximoSeguimiento.toLocaleDateString("es-CL", {
                      timeZone: "UTC",
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
