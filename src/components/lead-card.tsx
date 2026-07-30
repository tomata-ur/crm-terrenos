import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadEstadoSelect } from "@/components/lead-estado-select";
import { toWhatsappLink } from "@/lib/whatsapp";
import { CATEGORIA_LABEL } from "@/lib/lead-labels";
import type {
  CategoriaLead,
  EstadoPipeline,
} from "@/generated/prisma/enums";

export function LeadCard({
  lead,
}: {
  lead: {
    id: string;
    nombre: string;
    telefono: string | null;
    categoria: CategoriaLead | null;
    estadoPipeline: EstadoPipeline;
  };
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className="font-medium hover:underline"
          >
            {lead.nombre}
          </Link>
          {lead.telefono && (
            <a
              href={toWhatsappLink(lead.telefono)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-emerald-600 hover:text-emerald-700"
              title="Continuar en WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
          )}
        </div>
        {lead.categoria && (
          <Badge variant="outline" className="w-fit">
            {CATEGORIA_LABEL[lead.categoria]}
          </Badge>
        )}
        <LeadEstadoSelect leadId={lead.id} estado={lead.estadoPipeline} />
      </CardContent>
    </Card>
  );
}
