"use client";

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

function getHash(value) {
  let hash = 0;

  for (const char of value) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return Math.abs(hash);
}

function distribute(baseValue, weights, index) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  return Math.round((baseValue * weights[index]) / totalWeight);
}

function getSoftwareEndpointRows(softwareName, baseInstalled, tickSeed) {
  const endpointCount = Math.min(
    8,
    Math.max(4, Math.round(baseInstalled / 25)),
  );

  return Array.from({ length: endpointCount }, (_, index) => {
    const statusIndex = (tickSeed + index) % 3;
    const status = ["Active", "Idle", "Offline"][statusIndex];

    return {
      endpointId: `ENG-${String(index + 1).padStart(3, "0")}`,
      softwareName,
      lastSeen: `${2 + ((tickSeed + index) % 22)} mins ago`,
      status,
    };
  });
}

export function SoftwarePage({ categoryId, subcategoryId, softwareSlug }) {
  const { categories, lastUpdatedAt, simulationIntervalMs } = useSimulation();

  const category = categories.find((item) => item.id === categoryId);
  const subcategory = category?.subcategories.find(
    (item) => item.id === subcategoryId,
  );

  if (!category || !subcategory) {
    return (
      <AppShell
        title="Software Not Found"
        subtitle="Category or subcategory was not found."
      >
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">
            Use the navigation panel to choose a valid software path.
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const softwareNames = subcategory.software;
  const softwareIndex = softwareNames.findIndex(
    (name) => slugify(name) === softwareSlug,
  );

  if (softwareIndex === -1) {
    return (
      <AppShell
        title="Software Not Found"
        subtitle="Software slug does not map to this subcategory."
      >
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">
            Open software links from the subcategory page for a valid route.
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const softwareName = softwareNames[softwareIndex];
  const weights = softwareNames.map((name) => (getHash(name) % 5) + 2);

  const purchased = distribute(subcategory.purchased, weights, softwareIndex);
  const installedEndpoints = distribute(
    subcategory.installedEndpoints,
    weights,
    softwareIndex,
  );
  const activeUsers = distribute(
    subcategory.activeUsers,
    weights,
    softwareIndex,
  );
  const deniedAttempts = Math.max(
    0,
    distribute(subcategory.deniedAttempts, weights, softwareIndex),
  );
  const monthlyCost = distribute(
    subcategory.monthlyCostInr,
    weights,
    softwareIndex,
  );

  const utilization = getUtilizationRate(activeUsers, purchased);
  const health = getHealthTone(deniedAttempts, utilization);
  const tickSeed =
    lastUpdatedAt.getSeconds() + softwareIndex + getHash(softwareName);
  const endpointRows = getSoftwareEndpointRows(
    softwareName,
    installedEndpoints,
    tickSeed,
  );

  return (
    <AppShell
      title={`${softwareName} Detail`}
      subtitle={`${category.name} / ${subcategory.name} software-level simulation`}
      status={
        <Badge tone="info">
          Live simulation updates every{" "}
          {Math.round(simulationIntervalMs / 1000)}s | Last updated:{" "}
          {lastUpdatedAt.toLocaleTimeString("en-IN")}
        </Badge>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Purchased" value={formatNumber(purchased)} />
        <StatCard label="Installed" value={formatNumber(installedEndpoints)} />
        <StatCard label="Active" value={formatNumber(activeUsers)} />
        <StatCard label="Denied" value={formatNumber(deniedAttempts)} />
        <StatCard label="Monthly Cost" value={formatCurrency(monthlyCost)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Utilization and Health</CardTitle>
          <CardDescription>Software-level live behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Utilization</span>
              <span>{utilization}%</span>
            </div>
            <Progress value={utilization} />
          </div>
          <Badge tone={health.tone}>{health.label}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endpoint Activity</CardTitle>
          <CardDescription>
            Sample endpoint activity feed for {softwareName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="rounded-l-lg p-3">Endpoint</th>
                  <th className="p-3">Software</th>
                  <th className="p-3">Last Seen</th>
                  <th className="rounded-r-lg p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {endpointRows.map((row) => (
                  <tr
                    key={row.endpointId}
                    className="border-b border-slate-100"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {row.endpointId}
                    </td>
                    <td className="p-3 text-slate-700">{row.softwareName}</td>
                    <td className="p-3 text-slate-700">{row.lastSeen}</td>
                    <td className="p-3">
                      <Badge
                        tone={
                          row.status === "Active"
                            ? "success"
                            : row.status === "Idle"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
