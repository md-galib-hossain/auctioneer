"use client"

import { ArrowLeft, Users, Clock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AuctionRoomTimer } from "@/components/auction/auction-room-timer"
import type { AuctionRoomType } from "@/types/auction"

interface AuctionRoomHeaderProps {
  auctionRoom: AuctionRoomType
}

export function AuctionRoomHeader({ auctionRoom }: AuctionRoomHeaderProps) {
  const statusColor =
    {
      live: "bg-green-500",
      upcoming: "bg-blue-500",
      ended: "bg-gray-500",
    }[auctionRoom.status] || "bg-gray-500"

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold line-clamp-1">{auctionRoom.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-white ${statusColor}`}>
                {auctionRoom.status === "live" ? "Live Now" : auctionRoom.status === "upcoming" ? "Upcoming" : "Ended"}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{auctionRoom.participants?.length || 0} Participants</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <AuctionRoomTimer endsAt={auctionRoom.endsAt} />
          </div>
        </div>
      </div>
    </div>
  )
}
