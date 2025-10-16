import type { Metadata } from "next";
import ChatConversation from "@/components/chat/ChatConversation";

type ChatPageProps = {
  params: { id: string };
  searchParams?: { seed?: string };
};

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const snippet = params.id.slice(0, 8);
  return {
    title: `Conversation ${snippet} | Chat A.I+`,
    description:
      "Continue your discussion with Chat A.I+ and review previous messages.",
  };
}

export default function ConversationPage({
  params,
  searchParams,
}: ChatPageProps) {
  let seedValue: string | undefined;
  if (typeof searchParams?.seed === "string") {
    try {
      seedValue = decodeURIComponent(searchParams.seed);
    } catch (error) {
      seedValue = searchParams.seed;
    }
  }

  return <ChatConversation threadId={params.id} seed={seedValue} />;
}
