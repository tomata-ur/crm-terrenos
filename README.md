# CRM Venta de Terrenos

CRM a medida para venta de terrenos (loteos propios y corretaje de terceros), pensado desde el inicio para poder operar en el futuro como producto SaaS multi-tenant.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) 7 ORM sobre PostgreSQL
- [Supabase](https://supabase.com) (Postgres + Auth)
- Deploy en [Vercel](https://vercel.com)

## Setup local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y completa las variables con los datos de tu proyecto Supabase:

   ```bash
   cp .env.example .env
   ```

3. Aplica las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

4. Corre el servidor de desarrollo:

   ```bash
   npm run dev
   ```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura relevante

- `prisma/schema.prisma` — modelo de datos (empresa, usuarios, proyectos, lotes, leads, ventas, cuotas, comisiones). Todas las tablas llevan `empresaId` para soportar multi-tenancy futura.
- `src/lib/prisma.ts` — cliente Prisma singleton (usa el driver adapter de Postgres requerido por Prisma 7).
- `src/app` — rutas de la aplicación (App Router).

## Deploy

Cada push a `main` se despliega automáticamente en Vercel una vez conectado el repo (ver [Vercel Dashboard](https://vercel.com/dashboard) → Import Project).
