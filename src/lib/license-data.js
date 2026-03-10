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
        software: ["AutoCAD", "Civil 3D"],
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
        software: ["Fusion 360", "BIM Collaborate Pro"],
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
        software: ["Maya", "3ds Max"],
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
        software: ["Revit"],
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
        software: ["OpenRoads Designer"],
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
        software: ["MicroStation", "STAAD.Pro"],
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
        software: ["RAM Structural System"],
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
        software: ["Primavera Unifier"],
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
        software: ["Primavera P6 EPPM"],
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
        software: ["Primavera Cloud"],
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
        software: ["Trimble Connect"],
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
        software: ["Tekla Structural Designer"],
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
        software: ["Tekla Tedds"],
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
        software: ["Tekla Structures"],
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
  const softwareName = subcategory.software.find(
    (name) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") === softwareSlug,
  );

  if (!softwareName) {
    return null;
  }

  return {
    category,
    subcategory,
    softwareName,
  };
}
