"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/lib/socket";
import { AuctionRoomSocketClient } from "@/lib/socket/auction-room.socket";
import type { AuctionRoomType } from "@/types/auction";
import { AuctionRoomAccessModal } from "./auction-room-access-modal";
import { AuctionRoomHeader } from "./auction-room-header";
import { QuickBidFloat } from "./quick-bid-float";
import { QuickChatFloat } from "./quick-chat-float";
import { AuctionItemDisplay } from "./auction-item-display";
import { Button } from "@/components/ui/button";
import { AuctionChatSection } from "./auction-chat/auction-chat-section";
import { IChatMessage } from "./auction-chat/types";
import { IMeta } from "@/lib/interface";
import { AuctionBidSection } from "./auction-bid/auction-bid-section";

interface AuctionRoomViewProps {
  auctionRoom: AuctionRoomType;
  oldChats: IChatMessage[] | null;
 
  initialMeta: IMeta;
}



export function AuctionRoomView({ auctionRoom, oldChats, initialMeta }: AuctionRoomViewProps) {
  const { socket, isConnected } = useSocket();
  const [showAccessModal, setShowAccessModal] = useState(auctionRoom.isPrivate);
  const [hasAccess, setHasAccess] = useState(!auctionRoom.isPrivate);
  console.log(socket,isConnected,'check socket')
  const [quickBidActive, setQuickBidActive] = useState(false);
  const [quickChatActive, setQuickChatActive] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState(auctionRoom?.items?.[0]);
  useEffect(() => {
    if (!hasAccess || auctionRoom.isPrivate || !socket || !isConnected) {
      if (!isConnected) setJoinError("Waiting for server connection...");
      return;
    }
  

    const chatSocket = AuctionRoomSocketClient(socket);
    let retries = 3;
    const joinRoom = () => {
      console.log("Attempting to join non-private room:", auctionRoom.id);
      chatSocket.joinRoom(auctionRoom.id, "", (response) => {
        if (response.success) {
          console.log("Successfully joined non-private room:", auctionRoom.id);
          // setJoinError(null);
        } else {
          console.error("Failed to join non-private room:", response.message);
          if (retries > 0) {
            retries--;
            console.log("Retrying join...", retries);
            setTimeout(joinRoom, 2000);
          } else {
            setJoinError(response.message);
          }
        }
      });
    };

    joinRoom();

    return () => {
      chatSocket.leaveRoom(auctionRoom.id, (response) => {
        if (response.success) {
          console.log("Left room:", auctionRoom.id);
        }
      });
    };
  }, [hasAccess, auctionRoom.isPrivate, auctionRoom.id, socket, isConnected]);

  // Handle access granted for private rooms
  const handleAccessGranted = useCallback(() => {
    setHasAccess(true);
    setShowAccessModal(false);
  }, []);

  if (!hasAccess) {
    return (
      <AuctionRoomAccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        onAccessGranted={handleAccessGranted}
        auctionRoom={auctionRoom}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <AuctionRoomHeader auctionRoom={auctionRoom} />

      {joinError && (
        <div className="p-4 text-red-600 text-sm bg-red-50 mx-4 mt-2 rounded flex justify-between items-center">
          {joinError}
          {isConnected && (
            <Button size="sm" onClick={() => socket?.emit("auction:join-room", { auctionRoomId: auctionRoom.id, password: "" })}>
              Retry Join
            </Button>
          )}
        </div>
      )}

      {quickBidActive && <QuickBidFloat currentItem={currentItem} onClose={() => setQuickBidActive(false)} />}

      {quickChatActive && <QuickChatFloat auctionRoomId={auctionRoom.id} onClose={() => setQuickChatActive(false)} />}

      <div className="flex flex-col p-4 max-w-7xl mx-auto w-full">
        <div className="w-full mb-4">
          <AuctionItemDisplay item={currentItem} />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <AuctionBidSection
              auctionRoom={auctionRoom}
              currentItem={currentItem}
              onQuickBid={() => setQuickBidActive(true)}
            />
          </div>

          <div className="flex flex-col">
            <AuctionChatSection
              auctionRoomId={auctionRoom.id}
              onQuickChat={() => setQuickChatActive(true)}
              oldChats={oldChats}
              initialMeta={initialMeta}
            />
          </div>
        </div>
      </div>
    </div>
  );
}