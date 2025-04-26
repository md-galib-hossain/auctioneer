export type AuctionRoomStatus = "live" | "upcoming" | "ended"

export interface AuctionRoomType {
  id: string
  name: string
  description: string
  currentBid: number
  currency: string
  endsAt: string
  itemImage: string
  participants: number
  isPrivate: boolean
  status: AuctionRoomStatus
}

export interface Bid {
  id: string
  roomId: string
  userId: string
  amount: number
  timestamp: string
  userName: string
}

export interface ChatMessage {
  id: string
  roomId: string
  userId: string
  userName: string
  message: string
  timestamp: string
}
