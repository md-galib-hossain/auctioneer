"use client"

import { useState, useEffect } from "react"
import { AuctionRoom } from "@/components/auction/auction-room"
import { Skeleton } from "@/components/ui/skeleton"
import { useSocket } from "@/hooks/use-socket"
import { AuctionRoomType } from "@/types/auction"

export function AuctionRoomsList() {
  const [rooms, setRooms] = useState<AuctionRoomType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { socket } = useSocket()

  useEffect(() => {
    // Fetch initial rooms
    const fetchRooms = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        const mockRooms: AuctionRoomType[] = [
          {
            id: "room-1",
            name: "Luxury Watches Auction",
            description: "Exclusive collection of luxury timepieces",
            currentBid: 1250,
            currency: "USD",
            endsAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
            itemImage: "/placeholder.svg?height=200&width=300",
            participants: 24,
            isPrivate: false,
            status: "live",
          },
          {
            id: "room-2",
            name: "Vintage Vinyl Records",
            description: "Rare collection of 1960s vinyl records",
            currentBid: 350,
            currency: "USD",
            endsAt: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
            itemImage: "/placeholder.svg?height=200&width=300",
            participants: 18,
            isPrivate: false,
            status: "live",
          },
          {
            id: "room-3",
            name: "Modern Art Collection",
            description: "Contemporary art from emerging artists",
            currentBid: 4500,
            currency: "USD",
            endsAt: new Date(Date.now() + 5400000).toISOString(), // 1.5 hours from now
            itemImage: "/placeholder.svg?height=200&width=300",
            participants: 32,
            isPrivate: true,
            status: "live",
          },
          {
            id: "room-4",
            name: "Antique Furniture",
            description: "18th century European furniture collection",
            currentBid: 2800,
            currency: "USD",
            endsAt: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
            itemImage: "/placeholder.svg?height=200&width=300",
            participants: 15,
            isPrivate: false,
            status: "live",
          },
          {
            id: "room-5",
            name: "Sports Memorabilia",
            description: "Signed collectibles from legendary athletes",
            currentBid: 950,
            currency: "USD",
            endsAt: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
            itemImage: "/placeholder.svg?height=200&width=300",
            participants: 41,
            isPrivate: false,
            status: "live",
          },
          {
            id: "room-6",
            name: "Premium Domain Names",
            description: "Exclusive digital assets auction",
            currentBid: 5000,
            currency: "USD",
            endsAt: new Date(Date.now() + 14400000).toISOString(), // 4 hours from now
            itemImage: "/placeholder.svg?height=200&width=300",
            participants: 27,
            isPrivate: true,
            status: "upcoming",
          },
        ]

        setRooms(mockRooms)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch auction rooms:", error)
        setIsLoading(false)
      }
    }

    fetchRooms()

    // Set up socket listeners for real-time updates
    if (socket) {
      // Listen for new auction rooms
      socket.on("new_auction_room", (newRoom: AuctionRoomType) => {
        setRooms((prevRooms) => [...prevRooms, newRoom])
      })

      // Listen for bid updates
      socket.on("bid_update", ({ roomId, newBid }: { roomId: string; newBid: number }) => {
        setRooms((prevRooms) => prevRooms.map((room) => (room.id === roomId ? { ...room, currentBid: newBid } : room)))
      })

      // Listen for room status updates
      socket.on("room_update", (updatedRoom: Partial<AuctionRoomType> & { id: string }) => {
        setRooms((prevRooms) =>
          prevRooms.map((room) => (room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room)),
        )
      })
    }

    return () => {
      // Clean up socket listeners
      if (socket) {
        socket.off("new_auction_room")
        socket.off("bid_update")
        socket.off("room_update")
      }
    }
  }, [socket])

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
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-border">
        <p className="text-xl font-medium text-muted-foreground">No auction rooms available</p>
        <p className="mt-2 text-sm text-muted-foreground">Check back later for upcoming auctions</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <AuctionRoom key={room.id} room={room} />
      ))}
    </div>
  )
}
