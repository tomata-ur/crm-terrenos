import type {
  CategoriaLead,
  CapacidadCredito,
  PlazoEstimado,
  TipoSeguimiento,
} from "@/generated/prisma/enums";

export const CATEGORIA_LABEL: Record<CategoriaLead, string> = {
  comunidad: "Comunidad / grupo",
  individual_credito: "Individual con crédito bancario",
  contado_pie_alto: "Contado / pie alto",
};

export const CAPACIDAD_CREDITO_LABEL: Record<CapacidadCredito, string> = {
  pre_aprobado: "Pre-aprobado",
  por_evaluar: "Por evaluar",
  rechazado: "Rechazado",
};

export const PLAZO_LABEL: Record<PlazoEstimado, string> = {
  inmediato: "Inmediato",
  tres_meses: "3 meses",
  seis_meses: "6 meses",
  mas_de_seis_meses: "+6 meses",
};

export const TIPO_SEGUIMIENTO_LABEL: Record<TipoSeguimiento, string> = {
  whatsapp: "WhatsApp",
  llamada: "Llamada",
  email: "Email",
  visita: "Visita",
};
