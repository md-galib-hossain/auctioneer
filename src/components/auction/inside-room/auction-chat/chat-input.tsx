"use client";

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string, callback: () => void) => void;
  isConnected: boolean;
}

export const ChatInput = ({ onSend, isConnected }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    if (!message.trim() || !isConnected) return;
    onSend(message, () => setMessage(""));
  }, [message, isConnected, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  console.log("Rendering ChatInput"); // Debug log

  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        disabled={!isConnected}
      />
      <Button size="icon" onClick={handleSend} disabled={!message.trim() || !isConnected}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};