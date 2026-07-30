-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('admin', 'corredora');

-- CreateEnum
CREATE TYPE "EstadoLote" AS ENUM ('disponible', 'reservado', 'vendido');

-- CreateEnum
CREATE TYPE "CategoriaLead" AS ENUM ('comunidad', 'individual_credito', 'contado_pie_alto');

-- CreateEnum
CREATE TYPE "CapacidadCredito" AS ENUM ('pre_aprobado', 'por_evaluar', 'rechazado');

-- CreateEnum
CREATE TYPE "PlazoEstimado" AS ENUM ('inmediato', 'tres_meses', 'seis_meses', 'mas_de_seis_meses');

-- CreateEnum
CREATE TYPE "EstadoPipeline" AS ENUM ('nuevo', 'contactado', 'calificado', 'visita_agendada', 'visita_realizada', 'negociacion', 'cerrado', 'perdido');

-- CreateEnum
CREATE TYPE "TipoSeguimiento" AS ENUM ('whatsapp', 'llamada', 'email', 'visita');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('activa', 'convertida', 'vencida', 'cancelada');

-- CreateEnum
CREATE TYPE "FormaPago" AS ENUM ('contado', 'pie_y_cuotas', 'credito_hipotecario');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('promesa', 'escriturada', 'anulada');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('pendiente', 'pagada', 'atrasada');

-- CreateEnum
CREATE TYPE "EstadoComision" AS ENUM ('pendiente', 'pagada');

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rut" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "auth_user_id" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "comuna" TEXT,
    "descripcion" TEXT,
    "es_propio" BOOLEAN NOT NULL DEFAULT true,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manzanas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manzanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotes" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "manzana_id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "superficie_m2" DECIMAL(65,30),
    "precio_lista" DECIMAL(65,30),
    "estado" "EstadoLote" NOT NULL DEFAULT 'disponible',
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "proyecto_id" TEXT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "fuente" TEXT,
    "categoria" "CategoriaLead",
    "capacidad_credito" "CapacidadCredito",
    "plazo_estimado" "PlazoEstimado",
    "pie_disponible" DECIMAL(65,30),
    "estado_pipeline" "EstadoPipeline" NOT NULL DEFAULT 'nuevo',
    "assigned_to" TEXT,
    "created_by" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimientos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "tipo" "TipoSeguimiento" NOT NULL,
    "nota" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proximo_seguimiento" TIMESTAMP(3),

    CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "nombre" TEXT NOT NULL,
    "rut" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "monto_reserva" DECIMAL(65,30),
    "fecha_reserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3),
    "estado" "EstadoReserva" NOT NULL DEFAULT 'activa',

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "reserva_id" TEXT,
    "precio_venta" DECIMAL(65,30) NOT NULL,
    "forma_pago" "FormaPago" NOT NULL,
    "usuario_id" TEXT,
    "estado" "EstadoVenta" NOT NULL DEFAULT 'promesa',
    "fecha_venta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_pago" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "venta_id" TEXT NOT NULL,
    "monto_total" DECIMAL(65,30) NOT NULL,
    "num_cuotas" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuotas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "plan_pago_id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "fecha_pago" TIMESTAMP(3),
    "monto_pagado" DECIMAL(65,30),
    "estado" "EstadoCuota" NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "cuotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comisiones" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "venta_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "porcentaje" DECIMAL(65,30) NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "estado" "EstadoComision" NOT NULL DEFAULT 'pendiente',
    "fecha_pago" TIMESTAMP(3),

    CONSTRAINT "comisiones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_auth_user_id_key" ON "usuarios"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_empresa_id_idx" ON "usuarios"("empresa_id");

-- CreateIndex
CREATE INDEX "proyectos_empresa_id_idx" ON "proyectos"("empresa_id");

-- CreateIndex
CREATE INDEX "manzanas_empresa_id_idx" ON "manzanas"("empresa_id");

-- CreateIndex
CREATE INDEX "manzanas_proyecto_id_idx" ON "manzanas"("proyecto_id");

-- CreateIndex
CREATE INDEX "lotes_empresa_id_idx" ON "lotes"("empresa_id");

-- CreateIndex
CREATE INDEX "lotes_manzana_id_idx" ON "lotes"("manzana_id");

-- CreateIndex
CREATE INDEX "leads_empresa_id_idx" ON "leads"("empresa_id");

-- CreateIndex
CREATE INDEX "leads_estado_pipeline_idx" ON "leads"("estado_pipeline");

-- CreateIndex
CREATE INDEX "seguimientos_empresa_id_idx" ON "seguimientos"("empresa_id");

-- CreateIndex
CREATE INDEX "seguimientos_lead_id_idx" ON "seguimientos"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_lead_id_key" ON "clientes"("lead_id");

-- CreateIndex
CREATE INDEX "clientes_empresa_id_idx" ON "clientes"("empresa_id");

-- CreateIndex
CREATE INDEX "reservas_empresa_id_idx" ON "reservas"("empresa_id");

-- CreateIndex
CREATE INDEX "reservas_lote_id_idx" ON "reservas"("lote_id");

-- CreateIndex
CREATE INDEX "reservas_lead_id_idx" ON "reservas"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_reserva_id_key" ON "ventas"("reserva_id");

-- CreateIndex
CREATE INDEX "ventas_empresa_id_idx" ON "ventas"("empresa_id");

-- CreateIndex
CREATE INDEX "ventas_lote_id_idx" ON "ventas"("lote_id");

-- CreateIndex
CREATE UNIQUE INDEX "planes_pago_venta_id_key" ON "planes_pago"("venta_id");

-- CreateIndex
CREATE INDEX "planes_pago_empresa_id_idx" ON "planes_pago"("empresa_id");

-- CreateIndex
CREATE INDEX "cuotas_empresa_id_idx" ON "cuotas"("empresa_id");

-- CreateIndex
CREATE INDEX "cuotas_plan_pago_id_idx" ON "cuotas"("plan_pago_id");

-- CreateIndex
CREATE INDEX "comisiones_empresa_id_idx" ON "comisiones"("empresa_id");

-- CreateIndex
CREATE INDEX "comisiones_venta_id_idx" ON "comisiones"("venta_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manzanas" ADD CONSTRAINT "manzanas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manzanas" ADD CONSTRAINT "manzanas_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotes" ADD CONSTRAINT "lotes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotes" ADD CONSTRAINT "lotes_manzana_id_fkey" FOREIGN KEY ("manzana_id") REFERENCES "manzanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "reservas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes_pago" ADD CONSTRAINT "planes_pago_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes_pago" ADD CONSTRAINT "planes_pago_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuotas" ADD CONSTRAINT "cuotas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuotas" ADD CONSTRAINT "cuotas_plan_pago_id_fkey" FOREIGN KEY ("plan_pago_id") REFERENCES "planes_pago"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
