"use client"

import { useState } from "react"
import { X, ArrowUp, GripHorizontal, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Draggable } from "@/components/ui/draggable"

interface QuickBidFloatProps {
  currentItem: any // Replace with proper type
  onClose: () => void
}

export function QuickBidFloat({ currentItem, onClose }: QuickBidFloatProps) {
  const [bidAmount, setBidAmount] = useState((currentItem.currentPrice || 0) + 25)
  const [bidSuccess, setBidSuccess] = useState(false)
  const [currentBid, setCurrentBid] = useState(currentItem.currentPrice || 0)

  const handleBid = () => {
    // Implement bid submission logic
    console.log("Quick bid placed:", bidAmount)

    // Show success message and update current bid
    setBidSuccess(true)
    setCurrentBid(bidAmount)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setBidSuccess(false)
      // Prepare for next bid
      setBidAmount(bidAmount + 25)
    }, 3000)

    // Note: We're not calling onClose() here anymore
  }

  return (
    <Draggable initialPosition={{ x: 20, y: 80 }}>
      <Card className="w-[280px] shadow-lg border-rose-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-muted-foreground cursor-move" />
              <div>
                <h3 className="font-medium text-sm">Quick Bid</h3>
                <p className="text-xs text-muted-foreground">Current: ${currentBid}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="pl-5 h-8 text-sm"
                min={currentBid + 25}
                step={25}
              />
            </div>
            <Button
              className={`${bidSuccess ? "bg-green-600 hover:bg-green-700" : "bg-rose-600 hover:bg-rose-700"} text-white h-8 px-3`}
              onClick={handleBid}
              disabled={bidSuccess}
            >
              {bidSuccess ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Bid Placed
                </>
              ) : (
                <>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Bid
                </>
              )}
            </Button>
          </div>

          {bidSuccess && (
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Your bid of ${bidAmount} was placed successfully!
            </div>
          )}
        </CardContent>
      </Card>
    </Draggable>
  )
}
