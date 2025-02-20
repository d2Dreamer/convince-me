import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import PrintSentence from "./PrintSentence";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  content = content.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/,
    '<a target="_blank" style="color:blue;text-decoration:underline;" href="$2">$1</a>'
  );

  return (
    <Card
      style={{ animationTimingFunction: `steps(${content.length}, end)` }}
      className={cn(
        "text-[24px] bg-transparent ",

        role === "user"
          ? "  text-[#FFFFFF96] font-fruktur border-none"
          : "mr-auto text-[#FFF]   border-none font-fruktur"
      )}
    >
      <CardContent className="p-3 break-words whitespace-normal font-fruktur">
        <div className="text-sm">
          {role === "user" ? content : <PrintSentence sentence={content} />}
        </div>
      </CardContent>
    </Card>
  );
}
