"use client"

import { useState } from "react"
import { ArrowUp, Clock, User, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { AuctionRoomType } from "@/types/auction"

interface AuctionBidSectionProps {
  auctionRoom: AuctionRoomType
  currentItem: any // Replace with proper type
  onQuickBid: () => void
}

export function AuctionBidSection({ auctionRoom, currentItem, onQuickBid }: AuctionBidSectionProps) {
  const [bidAmount, setBidAmount] = useState((currentItem.currentPrice || 0) + 25)

  // Mock bid history data
  const bidHistory = [
    { id: "1", userId: "user1", userName: "Emma Thompson", amount: 750, timestamp: new Date(Date.now() - 120000) },
    { id: "2", userId: "user2", userName: "James Wilson", amount: 725, timestamp: new Date(Date.now() - 180000) },
    { id: "3", userId: "user3", userName: "Olivia Parker", amount: 700, timestamp: new Date(Date.now() - 240000) },
    { id: "4", userId: "user4", userName: "Noah Martinez", amount: 675, timestamp: new Date(Date.now() - 300000) },
    { id: "5", userId: "user5", userName: "Sophia Johnson", amount: 650, timestamp: new Date(Date.now() - 360000) },
    { id: "6", userId: "user6", userName: "William Davis", amount: 625, timestamp: new Date(Date.now() - 420000) },
    { id: "7", userId: "user7", userName: "Ava Rodriguez", amount: 600, timestamp: new Date(Date.now() - 480000) },
    { id: "8", userId: "user8", userName: "Liam Garcia", amount: 575, timestamp: new Date(Date.now() - 540000) },
    { id: "9", userId: "user9", userName: "Isabella Brown", amount: 550, timestamp: new Date(Date.now() - 600000) },
    { id: "10", userId: "user10", userName: "Mason Smith", amount: 525, timestamp: new Date(Date.now() - 660000) },
  ]

  const handleBid = () => {
    // Implement bid submission logic
    console.log("Placing bid:", bidAmount)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Bid History</span>
          <span className="text-rose-600">${currentItem.currentPrice}</span>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onQuickBid} className="h-8">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Quick Bid
        </Button>
      </CardHeader>

      <CardContent className="p-0 overflow-y-auto flex-1 h-[400px]">
        <div className="divide-y">
          {bidHistory.map((bid, index) => (
            <div
              key={bid.id}
              className={cn(
                "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors",
                index === 0 && "bg-rose-50",
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={bid.userName} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bid.userName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(bid.timestamp)}</span>
                </div>
              </div>

              <div className="text-right">
                <p className={cn("text-sm font-bold", index === 0 ? "text-rose-600" : "text-foreground")}>
                  ${bid.amount}
                </p>
                {index === 0 && <span className="text-xs font-medium text-rose-600">Highest Bid</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 border-t mt-auto">
        <div className="flex w-full gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="pl-7"
              min={(currentItem.currentPrice || 0) + 25}
              step={25}
            />
          </div>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleBid}>
            <ArrowUp className="h-4 w-4 mr-2" />
            Place Bid
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
