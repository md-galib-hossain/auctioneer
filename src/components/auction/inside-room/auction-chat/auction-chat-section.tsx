
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/socket";
import { useChatSocket } from "./useChatSocket";
import { ConnectionError } from "./connection-error";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { IChatMessage } from "./types";
import { authClient } from "@/lib/auth-client";
import axiosInstance from "@/lib/axios-config";
import useMeasure from "react-use-measure";

interface AuctionChatSectionProps {
  auctionRoomId: string;
  onQuickChat: () => void;
  oldChats: IChatMessage[] | null;
  initialMeta: { nextCursor: string | null };
}

export function AuctionChatSection({
  auctionRoomId,
  onQuickChat,
  oldChats,
  initialMeta,
}: AuctionChatSectionProps) {
  const { data: session } = authClient.useSession();
  const userId = useMemo(() => session?.user.id ?? "unknown", [session]);
  console.log("Rendering AuctionChatSection, userId:", userId);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialMeta.nextCursor);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(initialMeta.nextCursor);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { socket, isConnected } = useSocket();
  const { sendMessage } = useChatSocket({
    socket,
    isConnected,
    userId,
    auctionRoomId,
    setMessages,
    setConnectionError,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);
  const [measureRef, { height: newHeight }] = useMeasure();

  // Initialize messages with oldChats
  useEffect(() => {
    if (oldChats && oldChats.length > 0) {
      console.log("Initializing with oldChats:", oldChats);
      setMessages(
        oldChats.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    }
  }, [oldChats]);

  // Scroll to bottom when new messages are added or on initial load
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 1);
  }, []);

  // Adjust scroll position when new messages are prepended (infinite scroll)
  const scrollToLast = useCallback(() => {
    if (newHeight > heightRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = newHeight - heightRef.current;
      heightRef.current = newHeight;
    }
  }, [newHeight]);

  // Handle scroll and height updates
  useEffect(() => {
    if (!scrollRef.current || !messagesEndRef.current) return;

    console.log("Effect triggered for scroll handling");

    if (messages.length <= 15) {
      // Initial load or small number of messages
      heightRef.current = newHeight;
      scrollToBottom();
    } else {
      // Adjust scroll position after loading more messages
      scrollToLast();
    }
  }, [messages, newHeight, scrollToBottom, scrollToLast]);

  // Fetch more messages when scrolling to top
  const onScrollToTop = async () => {
    if (!nextCursor || loading || !hasMore) return;

    setLoading(true);
    setFetchError(null);

    try {
      const response = await axiosInstance.get(
        `/chat?auctionRoomId=${auctionRoomId}&limit=15&cursor=${nextCursor}`
      );
      const { meta, data } = response.data;
      console.log("Fetched more messages:", { meta, data });

      if (data.length > 0) {
        setMessages((prev) => [
          ...data.sort(
            (a: IChatMessage, b: IChatMessage) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
          ...prev,
        ]);
        setNextCursor(meta.nextCursor);
        setHasMore(!!meta.nextCursor);
      } else {
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error) {
      console.error("Error fetching more messages:", error);
      setFetchError("Failed to load more messages");
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll event to detect scroll-to-top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      console.log("SCROLLED TO TOP");
      console.log("scrollTop", e.currentTarget.scrollTop);
      console.log("newHeight", newHeight);
      console.log("oldHeight", heightRef.current);
      console.log("messages", messages);
      onScrollToTop();
    }
  };

  // Memoize messages to stabilize reference
  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          Live Chat ({memoizedMessages.length} messages in total)
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onQuickChat}
          className="h-8"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Quick Chat
        </Button>
      </CardHeader>

      <CardContent
        ref={scrollRef}
        onScroll={handleScroll}
        className="p-0 overflow-y-auto flex-1 max-h-[617px] relative"
      >
        <div ref={measureRef} className="p-3 space-y-3">
          <ConnectionError
            error={connectionError}
            onRetry={() => socket?.connect()}
            socket={socket}
          />
              {loading && (
            <div  className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more messages...
            </div>
          )}
          {!loading && hasMore && (
            <div  className="text-center text-sm text-muted-foreground" aria-live="polite">
              Scroll up to load more
            </div>
          )}
          {!loading && !hasMore && messages.length > 0 && (
            <div className="text-center text-sm text-muted-foreground" aria-live="polite">
              No more messages
            </div>
          )}
          {fetchError && (
            <div className="text-red-500 text-center">{fetchError}</div>
          )}
          {memoizedMessages.map((msg, index) => (
            <div
              key={msg.id || index}
              className="transition-opacity duration-200"
            >
              <ChatMessage message={msg} />
            </div>
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