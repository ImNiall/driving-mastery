"use client";
import { useEffect } from "react";

export default function SWKillRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw-kill.js", { scope: "/" });
    }
  }, []);
  return null;
}
