import React, { useState, useEffect, useRef } from "react";

type TypingEffectProps = {
  sentence: string;
};

const PrintSentence: React.FC<TypingEffectProps> = ({ sentence }) => {
  const [formattedText, setFormattedText] = useState<string>("");
  const [displayedText, setDisplayedText] = useState<string>("");
  const typingSpeed = 2;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedText]);

  useEffect(() => {
    const formatted = sentence
      .replace(/###\s(.+?):/g, "<h3>$1</h3>") // Format headings
      .replace(/-\s\*\*(.+?)\*\*:\s(.+?)(?=\n|$)/g, "<b>$1:</b> $2") // Format bold items
      .replace(/\*\*(.+?)\*\*:/g, "<b>$1:</b>") // Format bold labels without list items
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // Format general bold text
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>') // Format links
      .replace(/\n/g, "<br />") // Replace line breaks
      .replace(/\*\*(Co-Launch Partners):\*\*/g, "<strong>$1:</strong>"); // Handle Co-Launch Partners

    setFormattedText(formatted);
  }, [sentence]);

  useEffect(() => {
    if (!formattedText) return;

    let index = -1;
    const interval = setInterval(() => {
      if (index < formattedText.length - 1) {
        setDisplayedText((prev) => prev + formattedText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [formattedText]);

  return (
    <div
      ref={containerRef}
      style={{
        lineHeight: "1.6",
        whiteSpace: "pre-wrap",
      }}
      dangerouslySetInnerHTML={{ __html: displayedText }}
    ></div>
  );
};
export default PrintSentence;
