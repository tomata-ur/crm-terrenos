import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { NewLeadDialog } from "@/components/new-lead-dialog";
import { LeadCard } from "@/components/lead-card";
import { ETAPAS } from "@/lib/pipeline";

export default async function LeadsPage() {
  const usuario = await requireUsuario();

  const leads = await prisma.lead.findMany({
    where: { empresaId: usuario.empresaId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <NewLeadDialog />
      </div>

      {leads.length === 0 && (
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Todavía no hay leads. Crea el primero con el botón de arriba.
        </p>
      )}

      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => {
          const leadsEtapa = leads.filter(
            (l) => l.estadoPipeline === etapa.value
          );
          return (
            <div
              key={etapa.value}
              className="flex w-64 shrink-0 flex-col gap-3"
            >
              <p className="flex items-center justify-between text-sm font-medium text-zinc-500">
                {etapa.label}
                <span className="text-xs">{leadsEtapa.length}</span>
              </p>
              <div className="flex flex-col gap-2">
                {leadsEtapa.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
