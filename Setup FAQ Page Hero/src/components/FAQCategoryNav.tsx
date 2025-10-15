import { useEffect, useState } from "react";

interface Category {
  id: string;
  label: string;
}

const categories: Category[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "learning-features", label: "Learning & Features" },
  { id: "pricing-membership", label: "Pricing & Membership" },
  { id: "pass-guarantee", label: "Pass Guarantee & Refunds" },
  { id: "troubleshooting", label: "Troubleshooting & Support" },
];

interface FAQCategoryNavProps {
  activeCategory: string;
}

export function FAQCategoryNav({ activeCategory }: FAQCategoryNavProps) {
  const handleCategoryClick = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 100; // offset for fixed header space
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-10 py-6 border-b border-[#E5E7EB]">
      <div className="max-w-[960px] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-6 py-2 rounded-full text-[16px] transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-[#EEF2FF] text-[#1E3A8A]"
                  : "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
