"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSimulation } from "@/components/simulation-provider";
import { cn } from "@/lib/utils";

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium",
        active
          ? "bg-blue-100 text-blue-800"
          : "bg-slate-100 text-slate-800 hover:bg-slate-200",
      )}
    >
      {children}
    </Link>
  );
}

export function NavigationPanel() {
  const pathname = usePathname();
  const { categories } = useSimulation();

  return (
    <aside className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.12rem] text-slate-500">
        Navigation
      </p>
      <div className="mt-3 space-y-3">
        <NavLink href="/" active={pathname === "/"}>
          Overview
        </NavLink>
        <NavLink href="/categories" active={pathname === "/categories"}>
          All Categories
        </NavLink>

        <div className="space-y-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.09rem] text-slate-500">
            Vendor Categories
          </p>
          {categories.map((category) => {
            const isCategoryActive = pathname.startsWith(
              `/categories/${category.id}`,
            );

            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                  isCategoryActive
                    ? "border-blue-200 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                <span className="font-medium">{category.name}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {category.subcategories.length} types
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
