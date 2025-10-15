import { Search } from "lucide-react";

interface FAQSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function FAQSearch({ value, onChange }: FAQSearchProps) {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 mb-12">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search FAQs (e.g. 'cancel subscription' or 'AI mentor')"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[56px] pl-12 pr-4 border border-[#E5E7EB] rounded-[12px] text-[16px] text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-shadow group-hover:shadow-md"
        />
      </div>
    </div>
  );
}
