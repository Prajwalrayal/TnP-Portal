"use client";

import dynamic from "next/dynamic";

export const ErrorBoundaryWrapper = dynamic(() => import("./ErrorBoundary"), {
  ssr: false,
});
export const DarkMode = dynamic(() => import("./DarkMode"), { ssr: true });
export const Sidebar = dynamic(
  () => import("./Sidebar").then((mod) => mod.Sidebar),
  { ssr: true }
);
export const FloatingSidebar = dynamic(
  () => import("./Sidebar").then((mod) => mod.FloatingSidebar),
  { ssr: true }
);

export const Search = dynamic(() => import("./Search"), { ssr: true });
export const LoadingSpinner = dynamic(() => import("./LoadingSpinner"), {
  ssr: true,
});
export const ActivityCard = dynamic(() => import("./Cards/ActivityCard"), {
  ssr: true,
});
export const CompanyCard = dynamic(() => import("./Cards/CompanyCard"), {
  ssr: true,
});
export const HRCard = dynamic(() => import("./Cards/HRCard"), {
  ssr: true,
});
