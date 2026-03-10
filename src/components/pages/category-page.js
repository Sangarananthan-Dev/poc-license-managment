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
import { formatCurrency, formatNumber } from "@/lib/dashboard-utils";
import {
  getModelHealth,
  getModelUtilization,
  licenseModelMeta,
} from "@/lib/license-models";

export function CategoryPage({ categoryId }) {
  const { categories, lastUpdatedAt, simulationIntervalMs } = useSimulation();
  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <AppShell
        title="Category Not Found"
        subtitle="The requested category id does not exist."
      >
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">
              Choose a valid category from the left navigation.
            </p>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const purchased = category.subcategories.reduce(
    (sum, item) => sum + item.purchased,
    0,
  );
  const active = category.subcategories.reduce(
    (sum, item) => sum + item.activeUsers,
    0,
  );
  const denied = category.subcategories.reduce(
    (sum, item) => sum + item.deniedAttempts,
    0,
  );
  const cost = category.subcategories.reduce(
    (sum, item) => sum + item.monthlyCostInr,
    0,
  );

  return (
    <AppShell
      title={`${category.name} Category`}
      subtitle={`Owner: ${category.owner}. Drill down by subcategory and then software asset.`}
      status={
        <Badge tone="info">
          Live simulation updates every{" "}
          {Math.round(simulationIntervalMs / 1000)}s | Last updated:{" "}
          {lastUpdatedAt.toLocaleTimeString("en-IN")}
        </Badge>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Purchased" value={formatNumber(purchased)} />
        <SummaryCard label="Active" value={formatNumber(active)} />
        <SummaryCard label="Denied" value={formatNumber(denied)} />
        <SummaryCard label="Monthly Cost" value={formatCurrency(cost)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Subcategory Details</CardTitle>
          <CardDescription>
            Navigate to software-level view from each subcategory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="rounded-l-lg p-3">Subcategory</th>
                  <th className="p-3">Purchased</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Utilization</th>
                  <th className="p-3">Denied</th>
                  <th className="rounded-r-lg p-3">Health</th>
                </tr>
              </thead>
              <tbody>
                {category.subcategories.map((subcategory) => {
                  const modelUtilization = getModelUtilization(subcategory);
                  const health = getModelHealth(subcategory);
                  const modelLabel =
                    licenseModelMeta[subcategory.licenseModel]?.label ||
                    subcategory.name;

                  return (
                    <tr
                      key={subcategory.id}
                      className="border-b border-slate-100"
                    >
                      <td className="p-3">
                        <Link
                          href={`/categories/${category.id}/${subcategory.id}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {modelLabel}
                        </Link>
                      </td>
                      <td className="p-3 text-slate-700">
                        {formatNumber(subcategory.purchased)}
                      </td>
                      <td className="p-3 text-slate-700">
                        {formatNumber(subcategory.activeUsers)}
                      </td>
                      <td className="p-3">
                        <div className="w-36 space-y-1">
                          <Progress value={modelUtilization} />
                          <p className="text-xs text-slate-600">
                            {modelUtilization}%
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">
                        {formatNumber(subcategory.deniedAttempts)}
                      </td>
                      <td className="p-3">
                        <Badge tone={health.tone}>{health.title}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function SummaryCard({ label, value }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
