import type { FormaPago, EstadoVenta } from "@/generated/prisma/enums";

export const FORMA_PAGO_LABEL: Record<FormaPago, string> = {
  contado: "Contado",
  pie_y_cuotas: "Pie y cuotas",
  credito_hipotecario: "Crédito hipotecario",
};

export const ESTADO_VENTA_LABEL: Record<EstadoVenta, string> = {
  promesa: "Promesa",
  escriturada: "Escriturada",
  anulada: "Anulada",
};

export const FORMAS_PAGO: { value: FormaPago; label: string }[] = [
  { value: "contado", label: "Contado" },
  { value: "pie_y_cuotas", label: "Pie y cuotas" },
  { value: "credito_hipotecario", label: "Crédito hipotecario" },
];
