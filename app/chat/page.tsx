import dynamic from "next/dynamic";

const ChatKitWidget = dynamic(() => import("@/components/chat/ChatKitWidget"), {
  ssr: false,
});

export default function ChatPage() {
  return (
    <>
      <h1 style={{ display: "none" }}>Chat</h1>
      <ChatKitWidget />
    </>
  );
}
