import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  id: string;
  title: string;
  items: FAQItem[];
}

export function FAQSection({ id, title, items }: FAQSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="text-[#111827] mb-6">{title}</h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-[#E5E7EB] rounded-[12px] px-6 bg-white hover:shadow-sm transition-shadow"
          >
            <AccordionTrigger className="text-left text-[#111827] hover:no-underline py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#6B7280] text-[16px] pb-5 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
