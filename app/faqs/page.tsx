import React from "react";
import { FAQ_SECTIONS } from "@/content/faqs";

export default function FaqsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-semibold">
        Frequently Asked Questions
      </h1>
      <ul className="mt-6 space-y-4">
        {FAQ_SECTIONS.map((section) => (
          <li key={section.id} className="text-lg font-medium">
            {section.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
