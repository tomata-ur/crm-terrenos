export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        CRM Venta de Terrenos
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Scaffold en construcción. El dashboard, autenticación y módulos de
        proyectos, leads, reservas y ventas se irán agregando en los próximos
        pasos.
      </p>
    </div>
  );
}
