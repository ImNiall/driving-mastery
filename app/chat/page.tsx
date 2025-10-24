import dynamic from "next/dynamic";

const CustomChat = dynamic(() => import("@/components/chat/CustomChat"), {
  ssr: false,
});

export default function ChatPage() {
  return (
    <>
      <h1 style={{ display: "none" }}>Chat</h1>
      <div className="flex justify-center">
        <CustomChat />
      </div>
    </>
  );
}
