import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Checkbox } from "./ui/checkbox";
import { motion } from "motion/react";
import { useState } from "react";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  expandable?: boolean;
  details?: string;
  checkable?: boolean;
}

interface ContentSectionProps {
  title: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "success";
  items: ContentItem[];
  delay?: number;
}

export function ContentSection({ title, icon, variant = "default", items, delay = 0 }: ContentSectionProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const variantStyles = {
    default: "border-blue-200 bg-gradient-to-br from-blue-50/50 to-white",
    warning: "border-red-200 bg-gradient-to-br from-red-50/50 to-white",
    success: "border-green-200 bg-gradient-to-br from-green-50/50 to-white",
  };

  const iconStyles = {
    default: "bg-gradient-to-br from-blue-500 to-purple-500",
    warning: "bg-gradient-to-br from-red-500 to-orange-500",
    success: "bg-gradient-to-br from-green-500 to-emerald-500",
  };

  const handleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const progress = items.filter(item => item.checkable).length > 0
    ? Math.round((checkedItems.size / items.filter(item => item.checkable).length) * 100)
    : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Card className={`p-6 border-2 ${variantStyles[variant]}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl ${iconStyles[variant]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="mb-1">{title}</h3>
            {items.filter(item => item.checkable).length > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full ${iconStyles[variant]}`}
                  />
                </div>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: delay + 0.1 + index * 0.05 }}
            >
              {item.expandable ? (
                <Collapsible>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 group">
                      {item.icon && (
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-gray-600">
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-gray-900">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-9 mr-4 mt-2 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-sm text-gray-700">{item.details}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : item.checkable ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={() => handleCheck(item.id)}
                    className="mt-0.5"
                  />
                  <label htmlFor={item.id} className="flex-1 cursor-pointer">
                    <p className={`text-gray-900 ${checkedItems.has(item.id) ? 'line-through text-gray-500' : ''}`}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </label>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200">
                  {item.icon && (
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-gray-600">
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-gray-900">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                  {variant === "warning" && (
                    <Badge variant="destructive" className="text-xs">Avoid</Badge>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
