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

        {categories.map((category) => {
          const isCategoryActive = pathname.startsWith(
            `/categories/${category.id}`,
          );

          return (
            <div
              key={category.id}
              className="rounded-lg border border-slate-100 p-2"
            >
              <Link
                href={`/categories/${category.id}`}
                className={cn(
                  "block rounded-md px-2 py-1 text-sm font-semibold",
                  isCategoryActive
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-800 hover:bg-slate-50",
                )}
              >
                {category.name}
              </Link>

              <div className="mt-1 space-y-1">
                {category.subcategories.map((subcategory) => {
                  const href = `/categories/${category.id}/${subcategory.id}`;
                  const isActive = pathname.startsWith(href);

                  return (
                    <Link
                      key={`${category.id}-${subcategory.id}`}
                      href={href}
                      className={cn(
                        "block rounded-md px-2 py-1 text-xs",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {subcategory.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
