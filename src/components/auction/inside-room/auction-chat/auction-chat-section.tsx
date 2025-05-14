"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/socket";
import { useChatSocket } from "./useChatSocket";
import { ConnectionError } from "./connection-error";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { IChatMessage } from "./types";
import { authClient } from "@/lib/auth-client";
import axiosInstance from "@/lib/axios-config";
import { IMeta } from "@/lib/interface";
import { useDebounce } from "@/lib/useDebounce";

interface AuctionChatSectionProps {
  auctionRoomId: string;
  onQuickChat: () => void;
  oldChats: IChatMessage[] | null;
  initialMeta: IMeta;
}

export function AuctionChatSection({ auctionRoomId, onQuickChat, oldChats, initialMeta }: AuctionChatSectionProps) {
  const { data: session } = authClient.useSession();
  const userId = useMemo(() => session?.user.id ?? "unknown", [session]);
  console.log("Rendering AuctionChatSection, userId:", userId);

  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(initialMeta.nextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialMeta.nextCursor);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorMessageRef = useRef<HTMLDivElement>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const debouncedIsIntersecting = useDebounce(isIntersecting, 600);

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

  // Scroll to bottom for real-time messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  // Fetch more messages
  const fetchMoreMessages = useCallback(async () => {
    if (!nextCursor || isLoading || !hasMore) return;

    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await axiosInstance.get(`/chat?auctionRoomId=${auctionRoomId}&limit=15&cursor=${nextCursor}`);
      const { meta, data } = response.data;
      console.log("Fetched more messages:", { meta, data });

      if (data.length > 0) {
        setMessages((prev) => [
          ...data.sort((a: IChatMessage, b: IChatMessage) =>
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
      setIsLoading(false);
    }
  }, [auctionRoomId, nextCursor, isLoading, hasMore]);

  // Trigger fetch when debouncedIsIntersecting is true
  useEffect(() => {
    if (debouncedIsIntersecting && hasMore && !isLoading) {
      console.log("Debounced fetch triggered");
      fetchMoreMessages();
    }
  }, [debouncedIsIntersecting, hasMore, isLoading, fetchMoreMessages]);

  // Intersection Observer for top sentinel
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries[0].isIntersecting;
        console.log("Top sentinel intersection:", { isIntersecting: intersecting, hasMore, isLoading });
        setIsIntersecting(intersecting);
      },
      { root: containerRef.current, threshold: 0.5 }
    );

    if (messagesTopRef.current) {
      observer.observe(messagesTopRef.current);
    }

    return () => {
      if (messagesTopRef.current) {
        observer.unobserve(messagesTopRef.current);
      }
    };
  }, [hasMore, isLoading]);

  // Maintain scroll position when prepending messages
  useEffect(() => {
    if (!isLoading || !containerRef.current || !anchorMessageRef.current) return;

    const container = containerRef.current;
    const anchor = anchorMessageRef.current;
    const anchorOffsetTop = anchor.offsetTop;
    const currentScrollTop = container.scrollTop;

    container.scrollTop = currentScrollTop + (anchorOffsetTop - anchor.dataset.previousOffsetTop!);
    anchor.dataset.previousOffsetTop = anchorOffsetTop.toString();
  }, [messages, isLoading]);

  // Memoize messages to stabilize reference
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Set anchor message ref to the first message after initial load
  const setAnchorRef = useCallback((node: HTMLDivElement | null) => {
    if (node && !anchorMessageRef.current) {
      anchorMessageRef.current = node;
      anchorMessageRef.current.dataset.previousOffsetTop = node.offsetTop.toString();
    }
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Live Chat ({memoizedMessages.length} messages in total)</CardTitle>
        <Button variant="outline" size="sm" onClick={onQuickChat} className="h-8">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Quick Chat
        </Button>
      </CardHeader>

      <CardContent ref={containerRef} className="p-0 overflow-y-auto flex-1 max-h-[617px]">
        <ConnectionError error={connectionError} onRetry={() => socket?.connect()} socket={socket} />
        <div className="p-3 space-y-3">
          {isLoading && (
            <div ref={messagesTopRef} className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more messages...
            </div>
          )}
          {!isLoading && hasMore && (
            <div ref={messagesTopRef} className="text-center text-sm text-muted-foreground" aria-live="polite">
              Scroll up to load more
            </div>
          )}
          {!isLoading && !hasMore && messages.length > 0 && (
            <div ref={messagesTopRef} className="text-center text-sm text-muted-foreground" aria-live="polite">
              No more messages
            </div>
          )}
          {fetchError && !isLoading && (
            <div className="text-center text-sm text-red-600 flex items-center justify-center gap-2" aria-live="polite">
              {fetchError}
              <Button variant="link" onClick={fetchMoreMessages} disabled={isLoading}>
                Retry
              </Button>
            </div>
          )}
          {memoizedMessages.map((msg, index) => (
            <div
              key={msg.id}
              ref={index === 0 ? setAnchorRef : null}
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