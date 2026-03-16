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
import { BarListChart, StackedBar } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/dashboard-utils";
import {
  getModelHealth,
  getModelUtilization,
  licenseModelMeta,
} from "@/lib/license-models";

export function OverviewPage() {
  const { categories, rows, endpointHealth } = useSimulation();

  const totalPurchased = rows.reduce((sum, row) => sum + row.purchased, 0);
  const totalActive = rows.reduce((sum, row) => sum + row.activeUsers, 0);
  const totalDenied = rows.reduce((sum, row) => sum + row.deniedAttempts, 0);

  const categoryUtilization = categories.map((category) => {
    const purchased = category.subcategories.reduce(
      (sum, subcategory) => sum + subcategory.purchased,
      0,
    );
    const active = category.subcategories.reduce(
      (sum, subcategory) => sum + subcategory.activeUsers,
      0,
    );

    return {
      label: category.name,
      value: purchased > 0 ? Math.round((active / purchased) * 100) : 0,
      color: "#3b82f6",
    };
  });

  const vendorInstallations = categories
    .map((category) => {
      const installedEndpoints = category.subcategories.reduce(
        (sum, subcategory) => sum + subcategory.installedEndpoints,
        0,
      );

      return {
        id: category.id,
        installedEndpoints,
        name: category.name,
      };
    })
    .sort((a, b) => b.installedEndpoints - a.installedEndpoints);

  return (
    <AppShell
      title="Enterprise Utilization Dashboard"
      subtitle="Engineering license behavior across vendors, categories, and software assets."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Endpoints With ENG Software"
          value={formatNumber(endpointHealth.withEngSoftware)}
          subtext="Current device footprint"
        />
        <MetricCard
          label="Purchased Entitlements"
          value={formatNumber(totalPurchased)}
          subtext="All license types combined"
        />
        <MetricCard
          label="Active Usage (Current)"
          value={formatNumber(totalActive)}
          subtext="Users active in this cycle"
        />
        <MetricCard
          label="Denied Access Events"
          value={formatNumber(totalDenied)}
          subtext="Potential capacity bottlenecks"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Endpoint Coverage and Activity</CardTitle>
            <CardDescription>
              Endpoint activity across the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
                <span>Endpoints with ENG software</span>
                <span>
                  {formatNumber(endpointHealth.withEngSoftware)} /{" "}
                  {formatNumber(endpointHealth.total)}
                </span>
              </div>
              <Progress
                value={Math.round(
                  (endpointHealth.withEngSoftware / endpointHealth.total) * 100,
                )}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
                <span>Active endpoints (30 days)</span>
                <span>{formatNumber(endpointHealth.activeLast30Days)}</span>
              </div>
              <StackedBar
                segments={[
                  {
                    label: "Active",
                    value: endpointHealth.activeLast30Days,
                    color: "#16a34a",
                  },
                  {
                    label: "Idle",
                    value: endpointHealth.idleOver45Days,
                    color: "#f59e0b",
                  },
                ]}
              />
              <p className="mt-2 text-xs text-slate-500">
                Idle endpoints over 45 days:{" "}
                {formatNumber(endpointHealth.idleOver45Days)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Highest Installed Vendors</CardTitle>
            <CardDescription>
              Vendors ranked by engineering software footprint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {vendorInstallations.map((vendor, index) => (
              <article
                key={vendor.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">
                    {index + 1}. {vendor.name}
                  </p>
                  <Badge tone={index === 0 ? "info" : "neutral"}>
                    Installed
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  {formatNumber(vendor.installedEndpoints)} endpoints
                </p>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Category Portfolio</CardTitle>
            <CardDescription>
              Drill into category and subcategory level details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="rounded-l-lg p-3">Category</th>
                    <th className="p-3">License Type</th>
                    <th className="p-3">Purchased</th>
                    <th className="p-3">Active</th>
                    <th className="p-3">Utilization</th>
                    <th className="rounded-r-lg p-3">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const utilization = getModelUtilization(row);
                    const health = getModelHealth(row);
                    const modelLabel =
                      licenseModelMeta[row.licenseModel]?.label || row.name;

                    return (
                      <tr
                        key={`${row.categoryId}-${row.id}`}
                        className="border-b border-slate-100"
                      >
                        <td className="p-3">
                          <Link
                            href={`/categories/${row.categoryId}`}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {row.categoryName}
                          </Link>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/categories/${row.categoryId}/${row.id}`}
                            className="text-slate-700 hover:text-blue-700 hover:underline"
                          >
                            {modelLabel}
                          </Link>
                        </td>
                        <td className="p-3 text-slate-700">
                          {formatNumber(row.purchased)}
                        </td>
                        <td className="p-3 text-slate-700">
                          {formatNumber(row.activeUsers)}
                        </td>
                        <td className="p-3">
                          <div className="w-36 space-y-1">
                            <Progress value={utilization} />
                            <p className="text-xs text-slate-600">
                              {utilization}%
                            </p>
                          </div>
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

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Category Utilization</CardTitle>
            <CardDescription>
              Active vs purchased by vendor category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarListChart data={categoryUtilization} />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

function MetricCard({ label, value, subtext }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl md:text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500">{subtext}</p>
      </CardContent>
    </Card>
  );
}
