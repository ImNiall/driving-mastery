import { Card } from "./ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function ActionCard({ icon: Icon, title, description, onClick }: ActionCardProps) {
  return (
    <Card
      onClick={onClick}
      className="
        p-6 cursor-pointer
        border border-gray-200 hover:border-blue-300
        hover:shadow-lg hover:scale-[1.02]
        transition-all duration-200
        bg-white
      "
    >
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 flex-1 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 group">
          <span className="text-sm font-medium">Get started</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
}
