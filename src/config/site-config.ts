/**
 * Site Configuration - The Master Toggle
 *
 * This file controls which features are visible/active in the app.
 */

export type Theme = "purple" | "blue" | "green" | "orange" | "pink" | "monochrome";

export type FeatureId =
  | "landing"
  | "auth"
  | "billing"
  | "retirement";

export interface SiteConfig {
  // App Metadata
  name: string;
  description: string;
  url: string;

  // Feature Flags - Turn modules on/off
  activeFeatures: FeatureId[];

  // UI Configuration
  theme: Theme;
  isCatalog: boolean;
  showAdmin: boolean;

  // Social & SEO
  links: {
    twitter?: string;
    github?: string;
    docs?: string;
  };
}

export const siteConfig: SiteConfig = {
  // App Metadata
  name: "RetireRight",
  description: "Calculate when you can retire with confidence",
  url: "https://retireright.example.com",

  // Feature Flags
  activeFeatures: [
    "retirement",  // Main retirement planner
    "auth",        // Authentication (ready for production)
    "billing",     // Stripe payments (ready for production)
    "landing",     // Landing pages (available but not used in demo)
  ],

  // UI Configuration
  theme: "blue",
  isCatalog: false,  // No catalog mode needed
  showAdmin: false,

  // Social & SEO
  links: {
    github: "https://github.com/yourusername/retireright",
  },
};

/**
 * Helper function to check if a feature is active
 */
export function isFeatureActive(featureId: FeatureId): boolean {
  return siteConfig.activeFeatures.includes(featureId);
}

/**
 * Get all active features
 */
export function getActiveFeatures(): FeatureId[] {
  return siteConfig.activeFeatures;
}

/**
 * Get current theme
 */
export function getCurrentTheme(): Theme {
  return siteConfig.theme;
}
