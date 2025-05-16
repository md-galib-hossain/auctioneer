"use client";

import { Socket } from "socket.io-client";

interface Bid {
  id: string;
  auctionItemId: string;
  amount: number;
  user: { name: string };
  createdAt: string;
}

export const BidSocketClient = (socket: Socket) => {
  // Emit place bid event
  const placeBid = (
    roomCode: string,
    auctionItemId: string,
    amount: number,
    callback?: (response: { success: boolean; message: string }) => void
  ) => {
    socket.emit("bid:place-bid", { roomCode, auctionItemId, amount }, callback);
  };

  // Listen for new bids
  const onNewBid = (callback: (bid: Bid) => void) => {
    socket.on("bid:new-bid", callback);
  };

  return { placeBid, onNewBid };
};