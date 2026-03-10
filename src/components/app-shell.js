import { NavigationPanel } from "@/components/navigation-panel";

export function AppShell({ title, subtitle, status, children }) {
  return (
    <main className="min-h-screen w-full p-4 md:p-6 xl:p-8">
      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <NavigationPanel />
        </div>

        <section className="space-y-4">
          <header className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12rem] text-slate-500">
              Engineering License Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            {status ? <div className="mt-3">{status}</div> : null}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
