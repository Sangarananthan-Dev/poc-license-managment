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
import {
  formatCurrency,
  formatNumber,
  getUtilizationRate,
} from "@/lib/dashboard-utils";

export function CategoriesPage() {
  const { categories, lastUpdatedAt, simulationIntervalMs } = useSimulation();

  return (
    <AppShell
      title="All Software Categories"
      subtitle="Detailed category navigation across Autodesk, Bentley Systems, Oracle, and Trimble Inc."
      status={
        <Badge tone="info">
          Live simulation updates every{" "}
          {Math.round(simulationIntervalMs / 1000)}s | Last updated:{" "}
          {lastUpdatedAt.toLocaleTimeString("en-IN")}
        </Badge>
      }
    >
      <section className="grid gap-4 xl:grid-cols-2">
        {categories.map((category) => {
          const purchased = category.subcategories.reduce(
            (sum, item) => sum + item.purchased,
            0,
          );
          const active = category.subcategories.reduce(
            (sum, item) => sum + item.activeUsers,
            0,
          );
          const cost = category.subcategories.reduce(
            (sum, item) => sum + item.monthlyCostInr,
            0,
          );

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle>{category.name}</CardTitle>
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-sm font-medium text-blue-700 hover:underline"
                  >
                    Open Category
                  </Link>
                </div>
                <CardDescription>Owner: {category.owner}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Purchased</p>
                    <p className="font-semibold">{formatNumber(purchased)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Active</p>
                    <p className="font-semibold">{formatNumber(active)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Utilization</p>
                    <p className="font-semibold">
                      {getUtilizationRate(active, purchased)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-500">Monthly Cost</p>
                    <p className="font-semibold">{formatCurrency(cost)}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                    Subcategories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/categories/${category.id}/${subcategory.id}`}
                        className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </AppShell>
  );
}
