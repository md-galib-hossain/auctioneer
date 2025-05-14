"use client";

import { Socket } from "socket.io-client";

interface Participant {
  id: string;
  name: string;
  email: string;
}

export const AuctionRoomSocketClient = (socket: Socket) => {
  const joinRoom = (
    auctionRoomId: string,
    password: string,
    callback?: (response: { success: boolean; message: string }) => void
  ) => {
    console.log("Emitting auction:join-room", { auctionRoomId, password }); // Debug log
    socket.emit("auction:join-room", { auctionRoomId, password }, callback);
  };

  const leaveRoom = (
    auctionRoomId: string,
    callback?: (response: { success: boolean; message: string }) => void
  ) => {
    console.log("Emitting auction:leave-room", { auctionRoomId }); // Debug log
    socket.emit("auction:leave-room", { roomCode: auctionRoomId }, callback);
  };

  const onParticipantsUpdated = (
    callback: (data: { roomCode: string; participants: Participant[] }) => void
  ) => {
    socket.on("auction:participants-updated", callback);
  };

  return { joinRoom, leaveRoom, onParticipantsUpdated };
};