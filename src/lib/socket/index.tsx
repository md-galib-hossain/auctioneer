"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuctionChatSocketClient } from "./auction-chat.socket";
import { BidSocketClient } from "./auction-bid.socket";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children, token }: { children: React.ReactNode; token?: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("Initializing socket with token:", token || "none");

    const socketInstance = io("http://localhost:5000", {
      auth: { token: token || "" },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    socketInstance.on("reconnect_attempt", (attempt) => {
      console.log("Reconnection attempt:", attempt);
    });

    setSocket(socketInstance);

    // Initialize only chat and bid socket clients
    //    AuctionRoomSocketClient(socketInstance);

    AuctionChatSocketClient(socketInstance);
    BidSocketClient(socketInstance);

    return () => {
      console.log("Cleaning up socket");
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token]);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}