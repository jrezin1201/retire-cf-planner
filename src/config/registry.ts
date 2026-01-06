/**
 * Module Registry
 *
 * Central registry of all modules for the app.
 * Maps module IDs to their metadata (name, description, icon, category, route).
 */

import { type FeatureId } from "./site-config";

export interface ModuleMetadata {
  id: FeatureId;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: ModuleCategory;
  route: string;
  tags?: string[];
  isNew?: boolean;
  isPro?: boolean;
}

export type ModuleCategory =
  | "Finance"
  | "User Management"
  | "Commerce"
  | "Marketing";

export const moduleRegistry: Record<FeatureId, ModuleMetadata> = {
  retirement: {
    id: "retirement",
    name: "Retirement Planner",
    description:
      "Calculate when you can retire based on your savings, contributions, and spending goals. Includes portfolio tracking, year-by-year projections, and interactive charts.",
    icon: "📊",
    category: "Finance",
    route: "/",
    tags: ["retirement", "finance", "calculator", "planning"],
    isNew: true,
  },

  auth: {
    id: "auth",
    name: "Authentication",
    description:
      "Complete authentication system with NextAuth.js, OAuth providers, session management, and secure user accounts.",
    icon: "🔐",
    category: "User Management",
    route: "/auth/signin",
    tags: ["authentication", "oauth", "security"],
  },

  billing: {
    id: "billing",
    name: "Billing & Subscriptions",
    description:
      "Stripe integration with subscription management, webhook handling, pricing tables, and customer portal for paid features.",
    icon: "💳",
    category: "Commerce",
    route: "/billing",
    tags: ["stripe", "payments", "subscriptions"],
    isPro: true,
  },

  landing: {
    id: "landing",
    name: "Landing Pages",
    description:
      "Marketing pages and hero sections for showcasing the product (available but not used in demo mode).",
    icon: "🏠",
    category: "Marketing",
    route: "/landing",
    tags: ["hero", "marketing"],
  },
};

/**
 * Get all modules grouped by category
 */
export function getModulesByCategory(): Record<
  ModuleCategory,
  ModuleMetadata[]
> {
  const grouped: Record<ModuleCategory, ModuleMetadata[]> = {
    Finance: [],
    "User Management": [],
    Commerce: [],
    Marketing: [],
  };

  Object.values(moduleRegistry).forEach((module) => {
    grouped[module.category].push(module);
  });

  return grouped;
}

/**
 * Get module by ID
 */
export function getModule(id: FeatureId): ModuleMetadata | undefined {
  return moduleRegistry[id];
}

/**
 * Get all modules as array
 */
export function getAllModules(): ModuleMetadata[] {
  return Object.values(moduleRegistry);
}

/**
 * Search modules by name, description, or tags
 */
export function searchModules(query: string): ModuleMetadata[] {
  const lowerQuery = query.toLowerCase();

  return getAllModules().filter((module) => {
    const matchesName = module.name.toLowerCase().includes(lowerQuery);
    const matchesDescription = module.description
      .toLowerCase()
      .includes(lowerQuery);
    const matchesTags = module.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return matchesName || matchesDescription || matchesTags;
  });
}
