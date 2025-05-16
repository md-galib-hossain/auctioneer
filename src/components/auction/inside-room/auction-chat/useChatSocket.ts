import { useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import { AuctionChatSocketClient } from "@/lib/socket/auction-chat.socket";
import { IChatMessage } from "./types";

interface UseChatSocketProps {
  socket: Socket | null;
  isConnected: boolean;
  userId: string;
  auctionRoomId: string;
  setMessages: React.Dispatch<React.SetStateAction<IChatMessage[]>>;
  setConnectionError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useChatSocket = ({
  socket,
  isConnected,
  userId,
  auctionRoomId,
  setMessages,
  setConnectionError,
}: UseChatSocketProps) => {
  const sendMessage = useCallback(
    (
      message: string,
      callback?: (response: { success: boolean; message: string }) => void
    ) => {
      if (!socket || !isConnected || !message.trim()) {
        setConnectionError(
          !message.trim()
            ? "Message cannot be empty"
            : "Not connected to chat server"
        );
        return;
      }
     

      const tempId = `temp-${Date.now()}`;
      //   const optimisticMessage: IChatMessage = {
      //     id: tempId,
      //     content: message,
      //     user: { id: "temp-user", name: "You", role: "user", email: "", emailVerified: false, image: null },
      //     userId: "temp-user",
      //     createdAt: new Date().toISOString(),
      //     isSystem: false,
      //   };
    

      const chatSocket = AuctionChatSocketClient(socket);
      chatSocket.sendMessage(userId, auctionRoomId, message, (response) => {
        if (response.success) {
          console.log("Message sent successfully");
          setConnectionError(null);
        } else {
          console.error("Failed to send message:", response.message);
          setConnectionError(response.message);
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        }
        callback?.(response);
      });
    },
    [
      socket,
      isConnected,
      userId,
      auctionRoomId,
      setMessages,
      setConnectionError,
    ]
  );

  useEffect(() => {
    console.log("Chat socket status:", { socket, isConnected });

    if (!socket || !isConnected) {
      setConnectionError("Unable to connect to chat server. Retrying...");
      return;
    }

    setConnectionError(null);
    const chatSocket = AuctionChatSocketClient(socket);

    const handleNewMessage = (newMessage: Partial<IChatMessage>) => {
      const formattedMessage: IChatMessage = {
        id: newMessage.id ?? `temp-${Date.now()}`,
        content: newMessage.content ?? "",
        user: {
          id: newMessage.user?.id ?? "unknown",
          name:
            newMessage.user?.id === userId
              ? "You"
              : newMessage.user?.name ?? "Unknown",
          role: newMessage.user?.role ?? "user",
          email: newMessage.user?.email ?? "",
          emailVerified: newMessage.user?.emailVerified ?? false,
          image: newMessage.user?.image ?? null,
        },
        userId: newMessage.userId ?? "unknown",
        createdAt: newMessage.createdAt ?? new Date().toISOString(),
        isSystem: newMessage.isSystem ?? false,
      };
      setMessages((prev) =>
        [...prev, formattedMessage].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
      setConnectionError(`Connection error: ${error.message}`);
    };

    chatSocket.onNewMessage(handleNewMessage);
    socket.on("connect_error", handleConnectError);
    socket.on("error", handleConnectError);

    return () => {
      socket.off("chat:new-message", handleNewMessage);
      socket.off("connect_error", handleConnectError);
      socket.off("error", handleConnectError);
      console.log("Cleaned up socket listeners");
    };
  }, [socket, isConnected, auctionRoomId, setMessages, setConnectionError]);

  return { sendMessage };
};
