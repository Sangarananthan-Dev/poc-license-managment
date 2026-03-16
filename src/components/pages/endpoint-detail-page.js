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
import { getEndpointById } from "@/lib/endpoints-data";

export function EndpointDetailPage({ endpointId }) {
  const endpoint = getEndpointById(endpointId);

  if (!endpoint) {
    return (
      <AppShell
        title="Endpoint Not Found"
        subtitle="The requested endpoint id does not exist in inventory data"
      >
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">
              Go back to endpoints list and choose a valid endpoint.
            </p>
            <Link
              href="/endpoints"
              className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline"
            >
              Back to Endpoints
            </Link>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Endpoint ${endpoint.endpointId}`}
      subtitle="Detailed endpoint profile and installed software coverage"
      status={
        <Badge tone="info">
          Last seen: {endpoint.lastSeen} | Location: {endpoint.location}
        </Badge>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Hostname" value={endpoint.hostname} />
        <InfoCard label="Operating System" value={endpoint.os} />
        <InfoCard label="Assigned User" value={endpoint.user} />
        <InfoCard label="Department" value={endpoint.department} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Endpoint Status</CardTitle>
          <CardDescription>
            Current endpoint state in current inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
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
            <p className="text-sm text-slate-600">
              Installed software count: {endpoint.softwareCount}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installed Software</CardTitle>
          <CardDescription>
            Software assets discovered on this endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {endpoint.installedSoftware.map((software) => (
              <article
                key={software}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {software}
                </p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <Link
        href="/endpoints"
        className="inline-block text-sm font-medium text-blue-700 hover:underline"
      >
        ? Back to Endpoints
      </Link>
    </AppShell>
  );
}

function InfoCard({ label, value }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
