"use client";
import { Header } from "@/components/Header";
import { useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { PromptInput } from "./prompt-input";
import Loader from "./ui/Loader";
import { ScrollArea } from "./ui/scroll-area";
import { ChatMessage } from "./ui/chat-message";

function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setIsExpanded(true);

    // Use a single state update for both user and assistant messages.
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);
    setChatLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response },
      ]);
      setChatLoading(false);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "An error occurred. Please try again.",
        },
      ]);
      setChatLoading(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="App font-fruktur">
      {/* {IS_DEV && <TopBanner />} */}
      <Header />

      <div className="flex  items-center justify-center flex-col ">
        <span className="text-5xl"> Convince Me</span>
        <div
          className={`flex flex-col items-center lg:justify-center md:w-full lg:h-screen md:h-screen lg:w-[700px]
             bg-contain bg-no-repeat bg-center`}
        >
          <Card
            className={`w-full max-w-2xl overflow-auto mx-auto mt-4 bg-[#FFFFFF20] backdrop-blur-[6px] rounded-[8px] flex flex-col text-white border-[#FFFFFF33] ${
              isExpanded ? "chat-animate" : ""
            }`}
          >
            <CardContent className="flex-grow font-fruktur">
              <ScrollArea className="h-full pr-4 font-fruktur">
                {messages.map((msg, index) => (
                  <div key={index}>
                    <ChatMessage role={msg.role} content={msg.content} />
                    {msg.role == "assistant" && (
                      <div className="border-b-[1px] font-fruktur border-[#FFFFFF20]"></div>
                    )}
                  </div>
                ))}
                {chatLoading && <Loader />}
              </ScrollArea>
            </CardContent>
            <CardFooter
              ref={containerRef}
              onClick={() => {
                containerRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <PromptInput onSend={handleSendMessage} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
