"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { licenseCategories } from "@/lib/license-data";

const SIMULATION_INTERVAL_MS = 3000;
const ORGANIZATION_ENDPOINTS = 20640;

const SimulationContext = createContext(null);

function deepCloneCategories() {
  return licenseCategories.map((category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      software: [...subcategory.software],
    })),
  }));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getMaxActive(subcategory) {
  const purchasedCeiling = Math.max(
    1,
    Math.round(subcategory.purchased * 1.15),
  );
  return Math.min(subcategory.installedEndpoints, purchasedCeiling);
}

function getUpdatedSubcategory(subcategory) {
  const maxActive = getMaxActive(subcategory);
  const delta = randomInt(-6, 6);
  const nextActive = clamp(subcategory.activeUsers + delta, 0, maxActive);

  const pressure =
    subcategory.purchased > 0 ? nextActive / subcategory.purchased : 0;
  const deniedDelta = pressure > 0.9 ? randomInt(0, 3) : -randomInt(0, 2);
  const nextDeniedAttempts = clamp(
    subcategory.deniedAttempts + deniedDelta,
    0,
    60,
  );

  const nextPeakConcurrent = Math.max(
    nextActive,
    subcategory.peakConcurrent - 1 + randomInt(0, 2),
  );

  return {
    ...subcategory,
    activeUsers: nextActive,
    deniedAttempts: nextDeniedAttempts,
    peakConcurrent: nextPeakConcurrent,
  };
}

function getFlattenedRows(categories) {
  return categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      ...subcategory,
      categoryId: category.id,
      categoryName: category.name,
      owner: category.owner,
    })),
  );
}

function getEndpointHealth(rows) {
  const withEngSoftware = clamp(
    rows.reduce((sum, row) => sum + row.installedEndpoints, 0),
    0,
    ORGANIZATION_ENDPOINTS,
  );

  const activeLast30Days = clamp(
    rows.reduce((sum, row) => sum + row.activeUsers, 0),
    0,
    withEngSoftware,
  );

  return {
    total: ORGANIZATION_ENDPOINTS,
    withEngSoftware,
    activeLast30Days,
    idleOver45Days: withEngSoftware - activeLast30Days,
  };
}

function getRecommendations(rows, endpointHealth) {
  const underUtilized = rows
    .map((row) => ({
      ...row,
      utilization:
        row.purchased > 0
          ? Math.round((row.activeUsers / row.purchased) * 100)
          : 0,
    }))
    .filter((row) => row.utilization < 55)
    .sort((a, b) => a.utilization - b.utilization)[0];

  const denialRisk = rows.sort(
    (a, b) => b.deniedAttempts - a.deniedAttempts,
  )[0];

  return [
    underUtilized
      ? {
          id: "rightsizing",
          title: `${underUtilized.categoryName} ${underUtilized.name} appears oversized`,
          impact: `Utilization at ${underUtilized.utilization}%. Review entitlement for right-sizing.`,
          severity: "warning",
        }
      : null,
    denialRisk
      ? {
          id: "capacity",
          title: `${denialRisk.categoryName} ${denialRisk.name} has highest denial pressure`,
          impact: `${denialRisk.deniedAttempts} denied attempts in current simulation window.`,
          severity: denialRisk.deniedAttempts > 10 ? "danger" : "info",
        }
      : null,
    {
      id: "idle",
      title: "Idle endpoint reclamation opportunity",
      impact: `${endpointHealth.idleOver45Days} endpoints are currently idle over 45 days (simulated).`,
      severity: "info",
    },
  ].filter(Boolean);
}

export function SimulationProvider({ children }) {
  const [categories, setCategories] = useState(() => deepCloneCategories());
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCategories((previous) =>
        previous.map((category) => ({
          ...category,
          subcategories: category.subcategories.map(getUpdatedSubcategory),
        })),
      );
      setLastUpdatedAt(new Date());
    }, SIMULATION_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const rows = useMemo(() => getFlattenedRows(categories), [categories]);
  const endpointHealth = useMemo(() => getEndpointHealth(rows), [rows]);
  const recommendations = useMemo(
    () => getRecommendations([...rows], endpointHealth),
    [rows, endpointHealth],
  );

  const value = useMemo(
    () => ({
      categories,
      rows,
      endpointHealth,
      recommendations,
      lastUpdatedAt,
      simulationIntervalMs: SIMULATION_INTERVAL_MS,
    }),
    [categories, rows, endpointHealth, recommendations, lastUpdatedAt],
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);

  if (!context) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }

  return context;
}
