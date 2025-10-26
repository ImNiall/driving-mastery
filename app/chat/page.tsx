import dynamic from "next/dynamic";

const BasicChat = dynamic(() => import("@/components/chat/BasicChat"), {
  ssr: false,
});

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">AI Chat</h1>
      <BasicChat />
    </div>
  );
}
