

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

  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(!!initialMeta.nextCursor);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialMeta.nextCursor
  );
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

  const isPrependingMessagesRef = useRef(false);
  const scrollTopBeforePrependRef = useRef(0);
  const wasNearBottomRef = useRef(true);


  useEffect(() => {
    if (oldChats && oldChats.length > 0) {
      const sortedOldChats = oldChats.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sortedOldChats);
      setTimeout(() => {
        if (scrollRef.current) {
          heightRef.current = scrollRef.current.scrollHeight;
        }
        scrollToBottom();
        wasNearBottomRef.current = true;
      }, 50);
    } else if (scrollRef.current) { 
        heightRef.current = scrollRef.current.scrollHeight;
    }
  }, [oldChats]); 

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 1);
  }, []);


  useEffect(() => {
    if (!scrollRef.current || !messagesEndRef.current || newHeight === 0) {
        if (newHeight === 0 && messages.length > 0 && heightRef.current !== 0) {
             console.warn("AuctionChat: newHeight is 0 from useMeasure, but messages exist. Previous heightRef was:", heightRef.current);
        }
       
        if (newHeight === 0 && !isPrependingMessagesRef.current) return; 
    }


    if (isPrependingMessagesRef.current) {
   
      if (scrollRef.current) {
        const currentScrollableHeight = scrollRef.current.scrollHeight;
        const prevScrollableHeight = heightRef.current;

        if (currentScrollableHeight > prevScrollableHeight) {
          const addedHeight = currentScrollableHeight - prevScrollableHeight;
          const newScrollTop = scrollTopBeforePrependRef.current + addedHeight;
          scrollRef.current.scrollTop = newScrollTop;
        }
        heightRef.current = currentScrollableHeight;
      }
      isPrependingMessagesRef.current = false;
    } else {
 
      if (wasNearBottomRef.current || messages.length <= (oldChats?.length || 0) + 1) {
        scrollToBottom();
      }

      heightRef.current = scrollRef.current ? scrollRef.current.scrollHeight : newHeight;
    }
  }, [messages, newHeight, scrollToBottom, oldChats?.length]); 


  const onScrollToTop = async () => {
    if (!nextCursor || loading || !hasMore || !scrollRef.current) return;

    isPrependingMessagesRef.current = true;
    scrollTopBeforePrependRef.current = scrollRef.current.scrollTop;
   

    setLoading(true);
    setFetchError(null);

    try {
      const response = await axiosInstance.get(
        `/chat?auctionRoomId=${auctionRoomId}&limit=15&cursor=${nextCursor}`
      );
      const { meta, data } = response.data;

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
        isPrependingMessagesRef.current = false; 
      }
    } catch (error) {
      console.error("Error fetching more messages:", error);
      setFetchError("Failed to load more messages");
      isPrependingMessagesRef.current = false; 
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasMore && !loading) {
      onScrollToTop();
    }

    const { scrollHeight, scrollTop, clientHeight } = target;
    wasNearBottomRef.current = scrollHeight - scrollTop <= clientHeight + 30;
  };

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
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more messages...
            </div>
          )}
          {!loading && hasMore && (
            <div className="text-center text-sm text-muted-foreground" aria-live="polite">
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
              className="transition-opacity duration-200 "
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