import React from "react";

type ModuleLayoutProps = {
  children: React.ReactNode;
};

export default function ModuleLayout({ children }: ModuleLayoutProps) {
  return (
    <div className="bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-10 px-4 pt-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
