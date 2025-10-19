import type { ComponentType } from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatIcon,
  HomeIcon,
  InformationCircleIcon,
  LogoutIcon,
  QuizIcon,
  StarIcon,
  TrophyIcon,
  UserGroupIcon,
  UserIcon,
} from "@/components/icons";

export type DashboardViewKey =
  | "dashboard"
  | "modules"
  | "mock-test"
  | "leaderboard"
  | "test-ready"
  | "profile"
  | "memberships"
  | "about"
  | "theo";

export type IconComponent = ComponentType<{ className?: string }>;

export type NavigationItem = {
  key: string;
  label: string;
  href?: string;
  dashboardView?: DashboardViewKey;
  icon: IconComponent;
  requiresAuth?: boolean;
  section: "primary" | "secondary" | "bottom";
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
    key: "theo",
    label: "Theo Mentor",
    href: "/dashboard?view=theo",
    dashboardView: "theo",
    icon: ChatIcon,
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
    key: "test-ready",
    label: "Test Ready",
    href: "/test-ready",
    dashboardView: "test-ready",
    icon: StarIcon,
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
    key: "profile",
    label: "Profile",
    href: "/profile",
    dashboardView: "profile",
    icon: UserIcon,
    requiresAuth: true,
    section: "bottom",
  },
  {
    key: "signout",
    label: "Sign Out",
    icon: LogoutIcon,
    requiresAuth: true,
    section: "bottom",
    action: "signOut",
  },
];

export const PRIMARY_SIGNED_IN_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => item.requiresAuth && item.section === "primary",
);

export const SECONDARY_SIGNED_IN_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => item.section === "secondary" && item.action !== "signOut",
);

export const BOTTOM_SIGNED_IN_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => item.requiresAuth && item.section === "bottom",
);

export const SIGN_OUT_ITEM = NAVIGATION_ITEMS.find(
  (item) => item.action === "signOut",
);

export const PUBLIC_NAV_ITEMS = NAVIGATION_ITEMS.filter(
  (item) => !item.requiresAuth && !!item.href,
);
