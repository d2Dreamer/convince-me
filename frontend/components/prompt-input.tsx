"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

interface PromptInputProps {
  onSend: (message: string) => void;
}

export function PromptInput({ onSend }: PromptInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="flex w-full items-center space-x-2"
    >
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Convince me to give you key..."
        className="flex-1 border-[#FFFFFF20] h-14  p-4"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute bg-transparent  right-8"
      >
        <img src="/right-arrow-normal.svg" />
      </Button>
    </form>
  );
}
