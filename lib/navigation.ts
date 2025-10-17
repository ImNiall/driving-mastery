import type { ComponentType } from "react";
import {
  BookOpenIcon,
  ChatIcon,
  HomeIcon,
  InformationCircleIcon,
  LogoutIcon,
  QuizIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@/components/icons";

export type DashboardViewKey =
  | "dashboard"
  | "modules"
  | "mock-test"
  | "leaderboard"
  | "memberships"
  | "about";

export type IconComponent = ComponentType<{ className?: string }>;

export type NavigationItem = {
  key: string;
  label: string;
  href?: string;
  dashboardView?: DashboardViewKey;
  icon: IconComponent;
  requiresAuth?: boolean;
  section: "primary" | "secondary";
  action?: "signOut";
  showInSidebar?: boolean;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    dashboardView: "dashboard",
    icon: HomeIcon,
    requiresAuth: true,
    section: "primary",
  },
  {
    key: "modules",
    label: "Modules",
    href: "/modules",
    dashboardView: "modules",
    icon: BookOpenIcon,
    requiresAuth: true,
    section: "primary",
  },
  {
    key: "mock-test",
    label: "Mock Test",
    href: "/mock-test",
    dashboardView: "mock-test",
    icon: QuizIcon,
    requiresAuth: true,
    section: "primary",
  },
  {
    key: "leaderboard",
    label: "Leaderboard",
    href: "/leaderboard",
    dashboardView: "leaderboard",
    icon: TrophyIcon,
    requiresAuth: true,
    section: "secondary",
  },
  {
    key: "faqs",
    label: "FAQs",
    href: "/faqs",
    icon: ChatIcon,
    section: "secondary",
    showInSidebar: false,
  },
  {
    key: "memberships",
    label: "Memberships",
    href: "/memberships",
    icon: UserGroupIcon,
    section: "secondary",
    showInSidebar: false,
  },
  {
    key: "about",
    label: "About",
    href: "/about",
    icon: InformationCircleIcon,
    section: "secondary",
    showInSidebar: false,
  },
  {
    key: "signout",
    label: "Sign Out",
    icon: LogoutIcon,
    requiresAuth: true,
    section: "secondary",
    action: "signOut",
  },
];

export const PRIMARY_SIGNED_IN_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => item.requiresAuth && item.section === "primary",
);

export const SECONDARY_SIGNED_IN_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => item.section === "secondary" && item.action !== "signOut",
);

export const SIGN_OUT_ITEM = NAVIGATION_ITEMS.find(
  (item) => item.action === "signOut",
);

export const PUBLIC_NAV_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => !item.requiresAuth && !!item.href,
);
