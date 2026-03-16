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
import { slugify } from "@/lib/dashboard-utils";
import {
  formatStatValue,
  getModelHealth,
  getModelStats,
  licenseModelMeta,
} from "@/lib/license-models";

export function SubcategoryPage({ categoryId, subcategoryId }) {
  const { categories } = useSimulation();

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

  const stats = getModelStats(subcategory);
  const health = getModelHealth(subcategory);
  const modelLabel =
    licenseModelMeta[subcategory.licenseModel]?.label || subcategory.name;

  return (
    <AppShell
      title={`${category.name} / ${modelLabel}`}
      subtitle="Type-specific analytics with software-level drill-down"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={formatStatValue(item)}
          />
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>License Health</CardTitle>
          <CardDescription>
            {licenseModelMeta[subcategory.licenseModel]?.summary ||
              "Model-specific health indicators"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Utilization</span>
              <span>{health.utilization}%</span>
            </div>
            <Progress value={health.utilization} />
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={health.tone}>{health.title}</Badge>
            <p className="text-xs text-slate-500">{health.detail}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Software Assets in This License Type</CardTitle>
          <CardDescription>
            Open software-level details for endpoint and usage behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subcategory.software.map((software) => {
              const softwareSlug = slugify(software.name);

              return (
                <article
                  key={software.name}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {software.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {modelLabel} metrics available
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Expires: {software.expiryDate}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    EOL: {software.eol} | EOS: {software.eos}
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
