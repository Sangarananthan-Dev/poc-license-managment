"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { useSimulation } from "@/components/simulation-provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatCurrency,
  formatNumber,
  getHealthTone,
  getUtilizationRate,
  slugify,
} from "@/lib/dashboard-utils";

export function SubcategoryPage({ categoryId, subcategoryId }) {
  const { categories, lastUpdatedAt, simulationIntervalMs } = useSimulation();

  const category = categories.find((item) => item.id === categoryId);
  const subcategory = category?.subcategories.find(
    (item) => item.id === subcategoryId,
  );

  if (!category || !subcategory) {
    return (
      <AppShell
        title="Subcategory Not Found"
        subtitle="The requested subcategory does not exist."
      >
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">
              Use the navigation panel to select a valid subcategory.
            </p>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const utilization = getUtilizationRate(
    subcategory.activeUsers,
    subcategory.purchased,
  );
  const health = getHealthTone(subcategory.deniedAttempts, utilization);

  return (
    <AppShell
      title={`${category.name} / ${subcategory.name}`}
      subtitle="Subcategory analytics with software-level drill-down"
      status={
        <Badge tone="info">
          Live simulation updates every{" "}
          {Math.round(simulationIntervalMs / 1000)}s | Last updated:{" "}
          {lastUpdatedAt.toLocaleTimeString("en-IN")}
        </Badge>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Purchased"
          value={formatNumber(subcategory.purchased)}
        />
        <StatCard
          label="Installed Endpoints"
          value={formatNumber(subcategory.installedEndpoints)}
        />
        <StatCard
          label="Active Users"
          value={formatNumber(subcategory.activeUsers)}
        />
        <StatCard
          label="Peak Concurrent"
          value={formatNumber(subcategory.peakConcurrent)}
        />
        <StatCard
          label="Monthly Cost"
          value={formatCurrency(subcategory.monthlyCostInr)}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>License Health</CardTitle>
          <CardDescription>
            Current utilization and denial status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Utilization</span>
              <span>{utilization}%</span>
            </div>
            <Progress value={utilization} />
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={health.tone}>{health.label}</Badge>
            <p className="text-xs text-slate-500">
              Denied attempts in this cycle:{" "}
              {formatNumber(subcategory.deniedAttempts)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Software Assets in This Subcategory</CardTitle>
          <CardDescription>
            Open software level details for endpoint and usage behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subcategory.software.map((softwareName) => {
              const softwareSlug = slugify(softwareName);

              return (
                <article
                  key={softwareName}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {softwareName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Simulated metrics available
                  </p>
                  <Link
                    href={`/categories/${category.id}/${subcategory.id}/${softwareSlug}`}
                    className="mt-3 inline-block text-xs font-medium text-blue-700 hover:underline"
                  >
                    Open Software Detail
                  </Link>
                </article>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatCard({ label, value }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
