import type { Metadata } from "next";
import ChatLanding from "@/components/chat/ChatLanding";

export const metadata: Metadata = {
  title: "Chat | Chat A.I+",
  description:
    "Start a new conversation with Chat A.I+ to explore driving theory explanations, study ideas, and revision shortcuts.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Chat A.I+",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  description:
    "Chat A.I+ helps UK learner drivers revise theory content, practise questions, and summarise guidance in plain English.",
};

export default function ChatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChatLanding />
    </>
  );
}
