"use client";
import LandingPage from "@/components/LandingPage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <LandingPage
      onNavigateToAuth={(mode) => {
        // Route to a future auth page; if missing, stays on home
        try {
          router.push(`/auth?mode=${mode}`);
        } catch {
          // no-op
        }
      }}
    />
  );
}
