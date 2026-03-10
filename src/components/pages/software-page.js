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
import { slugify } from "@/lib/dashboard-utils";
import {
  formatStatValue,
  getModelHealth,
  getModelStats,
  licenseModelMeta,
} from "@/lib/license-models";

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

function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffInMs = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { daysLeft, label: "Expired", tone: "danger" };
  }

  if (daysLeft <= 45) {
    return { daysLeft, label: "Expiring Soon", tone: "warning" };
  }

  return { daysLeft, label: "Active", tone: "success" };
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

  const softwareList = subcategory.software;
  const softwareIndex = softwareList.findIndex(
    (item) => slugify(item.name) === softwareSlug,
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

  const software = softwareList[softwareIndex];
  const softwareName = software.name;
  const weights = softwareList.map((item) => (getHash(item.name) % 5) + 2);

  const softwareView = {
    ...subcategory,
    purchased: distribute(subcategory.purchased, weights, softwareIndex),
    installedEndpoints: distribute(
      subcategory.installedEndpoints,
      weights,
      softwareIndex,
    ),
    activeUsers: distribute(subcategory.activeUsers, weights, softwareIndex),
    peakConcurrent: distribute(
      subcategory.peakConcurrent,
      weights,
      softwareIndex,
    ),
    deniedAttempts: Math.max(
      0,
      distribute(subcategory.deniedAttempts, weights, softwareIndex),
    ),
    monthlyCostInr: distribute(
      subcategory.monthlyCostInr,
      weights,
      softwareIndex,
    ),
  };

  const stats = getModelStats(softwareView);
  const health = getModelHealth(softwareView);
  const modelLabel =
    licenseModelMeta[subcategory.licenseModel]?.label || subcategory.name;
  const expiryStatus = getExpiryStatus(software.expiryDate);

  const tickSeed =
    lastUpdatedAt.getSeconds() + softwareIndex + getHash(softwareName);
  const endpointRows = getSoftwareEndpointRows(
    softwareName,
    softwareView.installedEndpoints,
    tickSeed,
  );

  return (
    <AppShell
      title={`${softwareName} Detail`}
      subtitle={`${category.name} / ${modelLabel} software-level simulation`}
      status={
        <Badge tone="info">
          Live simulation updates every{" "}
          {Math.round(simulationIntervalMs / 1000)}s | Last updated:{" "}
          {lastUpdatedAt.toLocaleTimeString("en-IN")}
        </Badge>
      }
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
          <CardTitle>Contract and Renewal</CardTitle>
          <CardDescription>
            Software-level procurement and renewal metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Purchase Date" value={software.purchaseDate} />
            <MiniStat label="Expiry Date" value={software.expiryDate} />
            <MiniStat label="Contract ID" value={software.contractId} />
            <MiniStat label="Renewal Owner" value={software.renewalOwner} />
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={expiryStatus.tone}>{expiryStatus.label}</Badge>
            <p className="text-xs text-slate-500">
              {expiryStatus.daysLeft >= 0
                ? `${expiryStatus.daysLeft} days remaining`
                : `${Math.abs(expiryStatus.daysLeft)} days past expiry`}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utilization and Health</CardTitle>
          <CardDescription>
            {licenseModelMeta[subcategory.licenseModel]?.summary}
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

function MiniStat({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}
