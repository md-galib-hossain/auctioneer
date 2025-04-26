"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LockIcon, Users, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AuctionRoomType } from "@/types/auction"
import { cn } from "@/lib/utils"
import { AuctionRoomTimer } from "@/components/auction/auction-room-timer"

interface AuctionRoomProps {
  room: AuctionRoomType
}

export function AuctionRoom({ room }: AuctionRoomProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColor =
    {
      live: "bg-green-500",
      upcoming: "bg-blue-500",
      ended: "bg-gray-500",
    }[room.status] || "bg-gray-500"

  return (
    <Card
      className={cn("group overflow-hidden transition-all duration-300", isHovered && "shadow-lg")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative h-[200px] w-full overflow-hidden">
          <Image
            src={room.itemImage || "/placeholder.svg"}
            alt={room.name}
            fill
            className={cn("object-cover transition-transform duration-500", isHovered && "scale-110")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.participants}
            </Badge>

            {room.isPrivate && (
              <Badge variant="outline" className="bg-black/50 text-white flex items-center gap-1">
                <LockIcon className="h-3 w-3" />
                Private
              </Badge>
            )}

            <Badge className={cn("text-white", statusColor)}>
              {room.status === "live" ? "Live Now" : room.status === "upcoming" ? "Upcoming" : "Ended"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-xl font-semibold line-clamp-1">{room.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{room.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Bid</p>
            <p className="text-2xl font-bold">${room.currentBid.toLocaleString()}</p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <AuctionRoomTimer endsAt={room.endsAt} />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/auction-rooms/${room.id}`} className="flex items-center justify-center gap-2">
            Join Auction
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
