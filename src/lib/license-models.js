import {
  formatCurrency,
  formatNumber,
  getUtilizationRate,
} from "@/lib/dashboard-utils";

export const licenseModelMeta = {
  concurrent: {
    label: "Concurrent / Floating",
    summary: "Shared pool with denial risk under peak pressure",
  },
  named: {
    label: "Named User (SaaS)",
    summary: "Assigned-user model focused on assignment hygiene",
  },
  token: {
    label: "Token Based",
    summary: "Consumption model driven by token burn and overdraft events",
  },
  node: {
    label: "Node Locked (Standalone)",
    summary: "Device-bound entitlement with compliance and rehost constraints",
  },
  hybrid: {
    label: "Hybrid",
    summary: "Mix of fixed and floating pools with burst behavior",
  },
};

function stat(label, value, kind = "number") {
  return { kind, label, value };
}

export function getModelUtilization(subcategory) {
  if (subcategory.licenseModel === "named") {
    return getUtilizationRate(
      subcategory.activeUsers,
      subcategory.installedEndpoints,
    );
  }

  return getUtilizationRate(subcategory.activeUsers, subcategory.purchased);
}

export function getModelStats(subcategory) {
  switch (subcategory.licenseModel) {
    case "concurrent": {
      return [
        stat("Pool Size", subcategory.purchased),
        stat("Installed Endpoints", subcategory.installedEndpoints),
        stat("Active Sessions", subcategory.activeUsers),
        stat("Peak Concurrent", subcategory.peakConcurrent),
        stat("Monthly Cost", subcategory.monthlyCostInr, "currency"),
      ];
    }

    case "named": {
      const inactiveAssigned = Math.max(
        0,
        subcategory.installedEndpoints - subcategory.activeUsers,
      );

      return [
        stat("Seats Purchased", subcategory.purchased),
        stat("Users Assigned", subcategory.installedEndpoints),
        stat("MAU (30d)", subcategory.activeUsers),
        stat("Inactive Assigned", inactiveAssigned),
        stat("Monthly Cost", subcategory.monthlyCostInr, "currency"),
      ];
    }

    case "token": {
      const avgTokenPerSession =
        subcategory.activeUsers > 0
          ? (subcategory.peakConcurrent / subcategory.activeUsers) * 10
          : 0;

      return [
        stat("Token Pool", subcategory.purchased),
        stat("Tokens In Use", subcategory.activeUsers),
        stat("Peak Token Burn", subcategory.peakConcurrent),
        stat("Avg Token/Session", Number(avgTokenPerSession.toFixed(1))),
        stat("Monthly Cost", subcategory.monthlyCostInr, "currency"),
      ];
    }

    case "node": {
      const nonCompliantNodes = Math.max(
        0,
        subcategory.installedEndpoints - subcategory.purchased,
      );

      return [
        stat("Licensed Nodes", subcategory.purchased),
        stat("Bound Devices", subcategory.installedEndpoints),
        stat("Active Devices", subcategory.activeUsers),
        stat("Non-Compliant Nodes", nonCompliantNodes),
        stat("Monthly Cost", subcategory.monthlyCostInr, "currency"),
      ];
    }

    case "hybrid": {
      const fixedSeats = Math.round(subcategory.purchased * 0.45);
      const floatingPool = Math.max(0, subcategory.purchased - fixedSeats);

      return [
        stat("Total Entitlement", subcategory.purchased),
        stat("Fixed Seats", fixedSeats),
        stat("Floating Pool", floatingPool),
        stat("Burst Active", subcategory.activeUsers),
        stat("Monthly Cost", subcategory.monthlyCostInr, "currency"),
      ];
    }

    default: {
      return [
        stat("Purchased", subcategory.purchased),
        stat("Installed", subcategory.installedEndpoints),
        stat("Active", subcategory.activeUsers),
        stat("Peak", subcategory.peakConcurrent),
        stat("Monthly Cost", subcategory.monthlyCostInr, "currency"),
      ];
    }
  }
}

export function getModelHealth(subcategory) {
  const utilization = getModelUtilization(subcategory);

  switch (subcategory.licenseModel) {
    case "named": {
      const inactiveAssigned = Math.max(
        0,
        subcategory.installedEndpoints - subcategory.activeUsers,
      );

      if (
        inactiveAssigned > Math.round(subcategory.installedEndpoints * 0.25)
      ) {
        return {
          tone: "warning",
          title: "Assignment Waste",
          detail: `Inactive assigned users: ${formatNumber(inactiveAssigned)}`,
          utilization,
        };
      }

      return {
        tone: "success",
        title: "Healthy Adoption",
        detail: `Active assigned users: ${formatNumber(subcategory.activeUsers)}`,
        utilization,
      };
    }

    case "token": {
      if (subcategory.deniedAttempts > 8) {
        return {
          tone: "danger",
          title: "Token Overdraft Risk",
          detail: `Overdraft events this cycle: ${formatNumber(subcategory.deniedAttempts)}`,
          utilization,
        };
      }

      return {
        tone: "info",
        title: "Token Flow Stable",
        detail: `Peak token burn: ${formatNumber(subcategory.peakConcurrent)}`,
        utilization,
      };
    }

    case "node": {
      const nonCompliantNodes = Math.max(
        0,
        subcategory.installedEndpoints - subcategory.purchased,
      );

      if (nonCompliantNodes > 0) {
        return {
          tone: "danger",
          title: "Compliance Risk",
          detail: `Devices over license count: ${formatNumber(nonCompliantNodes)}`,
          utilization,
        };
      }

      return {
        tone: "success",
        title: "Compliant",
        detail: "Installed devices are within licensed node count",
        utilization,
      };
    }

    case "hybrid": {
      if (subcategory.deniedAttempts > 5) {
        return {
          tone: "warning",
          title: "Burst Saturation",
          detail: `Burst denials: ${formatNumber(subcategory.deniedAttempts)}`,
          utilization,
        };
      }

      return {
        tone: "info",
        title: "Balanced Hybrid Load",
        detail: `Peak concurrent load: ${formatNumber(subcategory.peakConcurrent)}`,
        utilization,
      };
    }

    default: {
      if (subcategory.deniedAttempts > 10) {
        return {
          tone: "danger",
          title: "Capacity Risk",
          detail: `Denied attempts in this cycle: ${formatNumber(subcategory.deniedAttempts)}`,
          utilization,
        };
      }

      if (utilization < 55) {
        return {
          tone: "warning",
          title: "Underutilized Pool",
          detail: "Pool can be right-sized based on observed active sessions",
          utilization,
        };
      }

      return {
        tone: "success",
        title: "Balanced Pool",
        detail: `Peak concurrent: ${formatNumber(subcategory.peakConcurrent)}`,
        utilization,
      };
    }
  }
}

export function formatStatValue(item) {
  if (item.kind === "currency") {
    return formatCurrency(item.value);
  }

  return formatNumber(item.value);
}
