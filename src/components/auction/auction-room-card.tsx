"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LockIcon, Users, ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { AuctionRoomType } from "@/types/auction"
import { cn } from "@/lib/utils"
import formatDate from "@/lib/formatDate"

interface AuctionRoomProps {
  room: AuctionRoomType
}

export function AuctionRoomCard({ room }: AuctionRoomProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColor =
    {
      LIVE: "bg-green-500 border-green-600",
      UPCOMING: "bg-blue-500 border-blue-600",
      ENDED: "bg-gray-500 border-gray-600",
    }[room.status] || "bg-gray-500 border-gray-600"

  const statusText =
    {
      LIVE: "Live Now",
      UPCOMING: "Upcoming",
      ENDED: "Ended",
    }[room.status] || room.status

  const buttonColor =
    {
      LIVE: "bg-green-600 hover:bg-green-700",
      UPCOMING: "bg-blue-600 hover:bg-blue-700",
      ENDED: "bg-gray-600 hover:bg-gray-700",
    }[room.status] || ""

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 border border-gray-200",
        isHovered && "shadow-lg border-gray-300 transform -translate-y-1",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative h-[220px] w-full overflow-hidden">
          <Image
            src={"/thumbnail.jpg"}
            alt={room?.title}
            fill
            className={cn("object-cover transition-transform duration-500", isHovered && "scale-110")}
          />

          {/* Room code badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-black font-medium px-3 py-1 shadow-sm"
            >
              Room #{room.roomCode}
            </Badge>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Bottom badges */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white border-0"
              >
                <Users className="h-3 w-3" />
                {room.participants?.length || 20}
              </Badge>

              {room.isPrivate && (
                <Badge
                  variant="outline"
                  className="bg-black/40 backdrop-blur-sm text-white border-white/20 flex items-center gap-1"
                >
                  <LockIcon className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>

            <Badge className={cn("text-white border px-2.5 py-1 text-xs font-medium", statusColor)}>{statusText}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-blue-700 transition-colors">{room.title}</h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {room.description || "No description available"}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div className="flex flex-col sm:flex-row sm:gap-3 w-full">
              <div className="flex items-center">
                <span className="font-medium text-gray-700">Starts:</span>
                <span className="ml-1">{formatDate(room.startTime)}</span>
              </div>
              <span className="hidden sm:block text-gray-300">•</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-700">Ends:</span>
                <span className="ml-1">{formatDate(room.endTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className={cn("w-full font-medium transition-all", buttonColor, isHovered && "shadow-md")}>
          <Link href={`/auction-rooms/${room.id}`} className="flex items-center justify-center gap-2">
            {room.status === "ENDED" ? "View Results" : "Join Auction"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
