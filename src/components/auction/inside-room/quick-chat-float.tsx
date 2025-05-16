"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, User, GripHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Draggable } from "@/components/ui/draggable"

interface QuickChatFloatProps {
  auctionRoomId: string
  onClose: () => void
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  isAdmin: boolean
  content: string
  timestamp: Date
}

export function QuickChatFloat({ auctionRoomId, onClose }: QuickChatFloatProps) {
  const [message, setMessage] = useState("")

  // Mock recent messages (last 3)
  const recentMessages: ChatMessage[] = [
    {
      id: "10",
      userId: "user6",
      userName: "William Davis",
      isAdmin: false,
      content: "The craftsmanship on this piece is incredible!",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "9",
      userId: "admin1",
      userName: "Auction Admin",
      isAdmin: true,
      content: "Yes, shipping is included for domestic orders. International shipping will have an additional fee.",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "8",
      userId: "user5",
      userName: "Sophia Johnson",
      isAdmin: false,
      content: "Is shipping included in the final price?",
      timestamp: new Date(Date.now() - 180000),
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implement message sending logic
      console.log("Quick message sent:", message)
      setMessage("")
      // In a real app, you would add the message to the messages array
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Draggable initialPosition={{ x: 20, y: 80 }}>
      <Card className="w-[300px] shadow-lg border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-muted-foreground cursor-move" />
              <h3 className="font-medium text-sm">Quick Chat</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2 mb-3 max-h-[120px] overflow-y-auto bg-gray-50 p-2 rounded-md">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <Avatar className="h-5 w-5 mt-0.5">
                  <AvatarImage src={`/placeholder.svg?height=20&width=20`} alt={msg.userName} />
                  <AvatarFallback>
                    <User className="h-2 w-2" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">{msg.userName}</span>
                    {msg.isAdmin && (
                      <Badge variant="outline" className="text-[8px] h-3 bg-rose-50 text-rose-600 border-rose-200">
                        Admin
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className={cn("text-xs mt-0.5 line-clamp-2", msg.isAdmin ? "text-rose-600" : "text-foreground")}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-8 text-sm"
            />
            <Button size="icon" className="h-8 w-8" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Draggable>
  )
}
