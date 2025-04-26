"use client"

import { useState, useEffect } from "react"

interface AuctionRoomTimerProps {
  endsAt: string
}

export function AuctionRoomTimer({ endsAt }: AuctionRoomTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endTime = new Date(endsAt)
      const difference = endTime.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft("Ended")
        return
      }

      // Calculate time units
      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      // Format the time left
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    // Calculate immediately and then set interval
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endsAt])

  return <span>{timeLeft}</span>
}
