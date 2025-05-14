"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/socket";
import { useChatSocket } from "./useChatSocket";
import { ConnectionError } from "./connection-error";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { IChatMessage } from "./types";
import { authClient } from "@/lib/auth-client";

interface AuctionChatSectionProps {
  auctionRoomId: string;
  onQuickChat: () => void;
  oldChats: IChatMessage[] | null;
}

export function AuctionChatSection({ auctionRoomId, onQuickChat, oldChats }: AuctionChatSectionProps) {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id ?? "unknown";
  console.log("Rendering AuctionChatSection, userId:", userId); 

  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useChatSocket({
    socket,
    isConnected,
    userId,
    auctionRoomId,
    setMessages,
    setConnectionError,
  });

  // Initialize messages with oldChats
  useEffect(() => {
    if (oldChats && oldChats.length > 0) {
      console.log("Initializing with oldChats:", oldChats);
      setMessages(
        oldChats.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    }
  }, [oldChats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Memoize messages to stabilize reference
  const memoizedMessages = useMemo(() => messages, [messages]);

  console.log({ messages, oldChats });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Live Chat</CardTitle>
        <Button variant="outline" size="sm" onClick={onQuickChat} className="h-8">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Quick Chat
        </Button>
      </CardHeader>

      <CardContent className="p-0 overflow-y-auto flex-1 h-[400px]">
        <ConnectionError error={connectionError} onRetry={() => socket?.connect()} socket={socket} />
        <div className="p-3 space-y-3">
          {memoizedMessages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-3 border-t mt-auto">
        <ChatInput onSend={sendMessage} isConnected={isConnected} />
      </CardFooter>
    </Card>
  );
}