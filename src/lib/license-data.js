function softwareItem(
  name,
  purchaseDate,
  expiryDate,
  contractId,
  renewalOwner,
) {
  return { contractId, expiryDate, name, purchaseDate, renewalOwner };
}

export const licenseCategories = [
  {
    id: "autodesk",
    name: "Autodesk",
    owner: "Design Engineering",
    subcategories: [
      {
        id: "concurrent-floating",
        name: "Concurrent / Floating",
        licenseModel: "concurrent",
        purchased: 50,
        installedEndpoints: 100,
        activeUsers: 22,
        peakConcurrent: 31,
        deniedAttempts: 14,
        monthlyCostInr: 1250000,
        software: [
          softwareItem(
            "AutoCAD",
            "2025-05-15",
            "2026-05-14",
            "ATD-CAD-001",
            "Meena R",
          ),
          softwareItem(
            "Civil 3D",
            "2025-05-15",
            "2026-05-14",
            "ATD-CAD-001",
            "Meena R",
          ),
        ],
      },
      {
        id: "named-user-saas",
        name: "Named User (SaaS)",
        licenseModel: "named",
        purchased: 180,
        installedEndpoints: 168,
        activeUsers: 121,
        peakConcurrent: 121,
        deniedAttempts: 0,
        monthlyCostInr: 780000,
        software: [
          softwareItem(
            "Fusion 360",
            "2025-07-01",
            "2026-06-30",
            "ATD-SAS-014",
            "Arun K",
          ),
          softwareItem(
            "BIM Collaborate Pro",
            "2025-07-01",
            "2026-06-30",
            "ATD-SAS-014",
            "Arun K",
          ),
        ],
      },
      {
        id: "token-based",
        name: "Token Based",
        licenseModel: "token",
        purchased: 2800,
        installedEndpoints: 410,
        activeUsers: 136,
        peakConcurrent: 149,
        deniedAttempts: 2,
        monthlyCostInr: 540000,
        software: [
          softwareItem(
            "Maya",
            "2025-09-10",
            "2026-09-09",
            "ATD-TKN-023",
            "Meena R",
          ),
          softwareItem(
            "3ds Max",
            "2025-09-10",
            "2026-09-09",
            "ATD-TKN-023",
            "Meena R",
          ),
        ],
      },
      {
        id: "hybrid",
        name: "Hybrid",
        licenseModel: "hybrid",
        purchased: 110,
        installedEndpoints: 142,
        activeUsers: 63,
        peakConcurrent: 81,
        deniedAttempts: 4,
        monthlyCostInr: 355000,
        software: [
          softwareItem(
            "Revit",
            "2025-03-01",
            "2026-02-28",
            "ATD-HBD-044",
            "Arun K",
          ),
        ],
      },
    ],
  },
  {
    id: "bentley-systems",
    name: "Bentley Systems",
    owner: "Infrastructure Engineering",
    subcategories: [
      {
        id: "concurrent-floating",
        name: "Concurrent / Floating",
        licenseModel: "concurrent",
        purchased: 85,
        installedEndpoints: 204,
        activeUsers: 54,
        peakConcurrent: 67,
        deniedAttempts: 8,
        monthlyCostInr: 610000,
        software: [
          softwareItem(
            "OpenRoads Designer",
            "2025-08-05",
            "2026-08-04",
            "BEN-CON-009",
            "Shakti V",
          ),
        ],
      },
      {
        id: "token-based",
        name: "Token Based",
        licenseModel: "token",
        purchased: 4200,
        installedEndpoints: 640,
        activeUsers: 190,
        peakConcurrent: 165,
        deniedAttempts: 3,
        monthlyCostInr: 910000,
        software: [
          softwareItem(
            "MicroStation",
            "2025-01-20",
            "2026-01-19",
            "BEN-TKN-020",
            "Shakti V",
          ),
          softwareItem(
            "STAAD.Pro",
            "2025-01-20",
            "2026-01-19",
            "BEN-TKN-020",
            "Shakti V",
          ),
        ],
      },
      {
        id: "node-locked",
        name: "Node Locked (Standalone)",
        licenseModel: "node",
        purchased: 72,
        installedEndpoints: 72,
        activeUsers: 43,
        peakConcurrent: 43,
        deniedAttempts: 0,
        monthlyCostInr: 215000,
        software: [
          softwareItem(
            "RAM Structural System",
            "2025-10-15",
            "2026-10-14",
            "BEN-NOD-007",
            "Shakti V",
          ),
        ],
      },
    ],
  },
  {
    id: "oracle",
    name: "Oracle",
    owner: "Project Controls",
    subcategories: [
      {
        id: "concurrent-floating",
        name: "Concurrent / Floating",
        licenseModel: "concurrent",
        purchased: 60,
        installedEndpoints: 115,
        activeUsers: 42,
        peakConcurrent: 50,
        deniedAttempts: 2,
        monthlyCostInr: 420000,
        software: [
          softwareItem(
            "Primavera Unifier",
            "2025-04-01",
            "2026-03-31",
            "ORC-CON-003",
            "Nisha P",
          ),
        ],
      },
      {
        id: "named-user-saas",
        name: "Named User (SaaS)",
        licenseModel: "named",
        purchased: 300,
        installedEndpoints: 285,
        activeUsers: 174,
        peakConcurrent: 174,
        deniedAttempts: 0,
        monthlyCostInr: 690000,
        software: [
          softwareItem(
            "Primavera P6 EPPM",
            "2025-06-18",
            "2026-06-17",
            "ORC-NAM-016",
            "Nisha P",
          ),
        ],
      },
      {
        id: "hybrid",
        name: "Hybrid",
        licenseModel: "hybrid",
        purchased: 52,
        installedEndpoints: 76,
        activeUsers: 29,
        peakConcurrent: 35,
        deniedAttempts: 1,
        monthlyCostInr: 133000,
        software: [
          softwareItem(
            "Primavera Cloud",
            "2025-11-01",
            "2026-10-31",
            "ORC-HYB-005",
            "Nisha P",
          ),
        ],
      },
    ],
  },
  {
    id: "trimble-inc",
    name: "Trimble Inc.",
    owner: "Manufacturing Engineering",
    subcategories: [
      {
        id: "named-user-saas",
        name: "Named User (SaaS)",
        licenseModel: "named",
        purchased: 128,
        installedEndpoints: 119,
        activeUsers: 81,
        peakConcurrent: 81,
        deniedAttempts: 0,
        monthlyCostInr: 248000,
        software: [
          softwareItem(
            "Trimble Connect",
            "2025-02-12",
            "2026-02-11",
            "TRM-NAM-010",
            "Rahul D",
          ),
        ],
      },
      {
        id: "token-based",
        name: "Token Based",
        licenseModel: "token",
        purchased: 3100,
        installedEndpoints: 460,
        activeUsers: 143,
        peakConcurrent: 151,
        deniedAttempts: 4,
        monthlyCostInr: 414000,
        software: [
          softwareItem(
            "Tekla Structural Designer",
            "2025-07-22",
            "2026-07-21",
            "TRM-TKN-013",
            "Rahul D",
          ),
        ],
      },
      {
        id: "node-locked",
        name: "Node Locked (Standalone)",
        licenseModel: "node",
        purchased: 75,
        installedEndpoints: 75,
        activeUsers: 46,
        peakConcurrent: 46,
        deniedAttempts: 0,
        monthlyCostInr: 176000,
        software: [
          softwareItem(
            "Tekla Tedds",
            "2025-09-30",
            "2026-09-29",
            "TRM-NOD-006",
            "Rahul D",
          ),
        ],
      },
      {
        id: "hybrid",
        name: "Hybrid",
        licenseModel: "hybrid",
        purchased: 220,
        installedEndpoints: 390,
        activeUsers: 112,
        peakConcurrent: 138,
        deniedAttempts: 5,
        monthlyCostInr: 560000,
        software: [
          softwareItem(
            "Tekla Structures",
            "2025-03-25",
            "2026-03-24",
            "TRM-HYB-008",
            "Rahul D",
          ),
        ],
      },
    ],
  },
];

export function getCategoryById(categoryId) {
  return licenseCategories.find((category) => category.id === categoryId);
}

export function getSubcategoryById(categoryId, subcategoryId) {
  const category = getCategoryById(categoryId);

  if (!category) {
    return null;
  }

  const subcategory = category.subcategories.find(
    (item) => item.id === subcategoryId,
  );

  if (!subcategory) {
    return null;
  }

  return { category, subcategory };
}

export function getAllLicenseRows() {
  return licenseCategories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      ...subcategory,
      categoryId: category.id,
      categoryName: category.name,
      owner: category.owner,
    })),
  );
}

export function getSubcategoryRows(category) {
  return category.subcategories.map((subcategory) => ({
    ...subcategory,
    categoryId: category.id,
    categoryName: category.name,
    owner: category.owner,
  }));
}

export function getSoftwareDetails(categoryId, subcategoryId, softwareSlug) {
  const result = getSubcategoryById(categoryId, subcategoryId);

  if (!result) {
    return null;
  }

  const { category, subcategory } = result;
  const software = subcategory.software.find(
    (item) =>
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") === softwareSlug,
  );

  if (!software) {
    return null;
  }

  return {
    category,
    subcategory,
    software,
  };
}
