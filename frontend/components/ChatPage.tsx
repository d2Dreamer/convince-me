"use client";
import { Header } from "@/components/Header";

function ChatPage() {
  return (
    <div className="App font-fruktur">
      {/* {IS_DEV && <TopBanner />} */}
      <Header />

      <div className="flex  items-center justify-center flex-col ">
        <span className="text-5xl"> Convince Me</span>
      </div>
    </div>
  );
}

export default ChatPage;
