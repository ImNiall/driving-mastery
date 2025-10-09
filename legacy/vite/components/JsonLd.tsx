import React, { useEffect } from "react";
import { assertString } from "../utils/assertString";

export default function JsonLd({ data }: { data: any }) {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-jsonld", "true");

    try {
      // Handle potentially non-serializable data
      const safeData = JSON.parse(JSON.stringify(data));
      script.text = JSON.stringify(safeData);
      document.head.appendChild(script);
    } catch (err) {
      console.warn("JsonLd: failed to create script", err);
      return;
    }

    return () => {
      try {
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      } catch (err) {
        // Script already removed; safe to ignore
      }
    };
  }, [data]);

  return null;
}
