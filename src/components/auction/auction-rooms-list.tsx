"use client";

import { useState, useEffect } from "react";
import { AuctionRoomCard } from "@/components/auction/auction-room-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuctionRoomType } from "@/types/auction";
import axiosInstance from "@/lib/axios-config";

export function AuctionRoomsList() {
  const [rooms, setRooms] = useState<AuctionRoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get("/auction-room");
        setRooms(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch auction rooms:", error);
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-lg border border-border p-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-border">
        <p className="text-xl font-medium text-muted-foreground">No auction rooms available</p>
        <p className="mt-2 text-sm text-muted-foreground">Check back later for upcoming auctions</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
      {rooms.map((room) => (
        <AuctionRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}