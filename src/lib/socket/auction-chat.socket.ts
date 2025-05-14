"use client";

import { IChatMessage } from "@/components/auction/inside-room/auction-chat/types";
import { Socket } from "socket.io-client";


export const AuctionChatSocketClient = (socket: Socket) => {
  // Emit send message event
  const sendMessage = (
    userId:string,
    auctionRoomId: string,
    content: string,
    callback?: (response: { success: boolean; message: string }) => void
  ) => {
    console.log("Sending message to room:", auctionRoomId);
    socket.emit("chat:send-message", { userId,auctionRoomId, content }, callback);
  };

  // Listen for new messages
  const onNewMessage = (callback: (message: IChatMessage) => void) => {
    socket.on("chat:new-message", callback);
  };

  return { sendMessage, onNewMessage };
};