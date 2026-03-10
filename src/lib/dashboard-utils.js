export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getUtilizationRate(active, purchased) {
  if (!purchased) {
    return 0;
  }

  return Math.round((active / purchased) * 100);
}

export function getHealthTone(deniedAttempts, utilization) {
  if (deniedAttempts > 10) {
    return { label: "Capacity Risk", tone: "danger" };
  }

  if (utilization < 50) {
    return { label: "Oversized", tone: "warning" };
  }

  return { label: "Balanced", tone: "success" };
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
