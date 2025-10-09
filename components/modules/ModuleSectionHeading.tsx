import type { ReactNode } from "react";

interface ModuleSectionHeadingProps {
  children: ReactNode;
}

export default function ModuleSectionHeading({
  children,
}: ModuleSectionHeadingProps) {
  return (
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{children}</h3>
  );
}
