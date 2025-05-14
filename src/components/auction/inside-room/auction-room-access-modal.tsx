"use client";

import React, { useState } from "react";
import { LockIcon, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSocket } from "@/lib/socket";
import { AuctionRoomSocketClient } from "@/lib/socket/auction-room.socket";
import type { AuctionRoomType } from "@/types/auction";

interface AuctionRoomAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: () => void;
  auctionRoom: AuctionRoomType;
}

export function AuctionRoomAccessModal({ isOpen, onClose, onAccessGranted, auctionRoom }: AuctionRoomAccessModalProps) {
  const { socket, isConnected } = useSocket();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!socket || !isConnected) {
      setError("Not connected to the server. Please try again.");
      setIsLoading(false);
      return;
    }

    const roomSocket = AuctionRoomSocketClient(socket);
    roomSocket.joinRoom(auctionRoom.id, password, (response) => {
      setIsLoading(false);
      if (response.success) {
        console.log("Joined auction room:", auctionRoom.id);
        onAccessGranted();
      } else {
        console.error("Failed to join room:", response.message);
        setError(response.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-rose-600" />
            Private Auction Room
          </DialogTitle>
          <DialogDescription>
            This auction room requires a password to enter. Please enter the password below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="room-password">Room Password</Label>
            <Input
              id="room-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || !isConnected}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isLoading || !password.trim() || !isConnected}
            >
              {isLoading ? "Verifying..." : "Enter Room"}
            </Button>
            {isConnected && error && (
              <Button
                variant="outline"
                onClick={handleSubmit}
                disabled={isLoading || !password.trim()}
              >
                Retry
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}