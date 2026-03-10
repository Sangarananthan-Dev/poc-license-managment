import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/dashboard-utils";
import { endpoints } from "@/lib/endpoints-data";

function getOsLabel(os) {
  if (os.toLowerCase().includes("mac")) {
    return "macOS";
  }

  return "Windows";
}

export function EndpointsPage() {
  const totalSoftwareInstalls = endpoints.reduce(
    (sum, endpoint) => sum + endpoint.softwareCount,
    0,
  );

  return (
    <AppShell
      title="Endpoint Inventory"
      subtitle="Endpoint-level view with OS, assigned user, and installed software footprint"
      status={<Badge tone="info">Dummy endpoint inventory data</Badge>}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Tracked Endpoints"
          value={formatNumber(endpoints.length)}
        />
        <MetricCard
          label="Windows Devices"
          value={formatNumber(
            endpoints.filter((item) => getOsLabel(item.os) === "Windows")
              .length,
          )}
        />
        <MetricCard
          label="macOS Devices"
          value={formatNumber(
            endpoints.filter((item) => getOsLabel(item.os) === "macOS").length,
          )}
        />
        <MetricCard
          label="Total Software Installs"
          value={formatNumber(totalSoftwareInstalls)}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Endpoint List</CardTitle>
          <CardDescription>
            Click an endpoint row to view detailed device and software data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="rounded-l-lg p-3">Endpoint</th>
                  <th className="p-3">OS</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Installed Software</th>
                  <th className="p-3">Status</th>
                  <th className="rounded-r-lg p-3">Open</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint) => (
                  <tr
                    key={endpoint.endpointId}
                    className="border-b border-slate-100"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {endpoint.endpointId}
                    </td>
                    <td className="p-3 text-slate-700">{endpoint.os}</td>
                    <td className="p-3 text-slate-700">{endpoint.user}</td>
                    <td className="p-3 text-slate-700">
                      {endpoint.department}
                    </td>
                    <td className="p-3 text-slate-700">
                      {formatNumber(endpoint.softwareCount)}
                    </td>
                    <td className="p-3">
                      <Badge
                        tone={
                          endpoint.status === "Active"
                            ? "success"
                            : endpoint.status === "Idle"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {endpoint.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/endpoints/${endpoint.endpointId}`}
                        className="text-xs font-medium text-blue-700 hover:underline"
                      >
                        View Details
                      </Link>
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

function MetricCard({ label, value }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
