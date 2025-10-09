import { Progress } from "@/components/ui/progress";

interface ModuleProgressProps {
  value: number;
}

export default function ModuleProgress({ value }: ModuleProgressProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-lg font-semibold text-gray-800">Test Your Knowledge</p>
      <Progress value={value} className="w-full sm:w-1/2 md:w-1/3" />
    </div>
  );
}
