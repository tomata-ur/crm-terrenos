import type { EstadoPipeline } from "@/generated/prisma/enums";

export const ETAPAS: { value: EstadoPipeline; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "calificado", label: "Calificado" },
  { value: "visita_agendada", label: "Visita agendada" },
  { value: "visita_realizada", label: "Visita realizada" },
  { value: "negociacion", label: "Negociación" },
  { value: "cerrado", label: "Cerrado" },
  { value: "perdido", label: "Perdido" },
];
