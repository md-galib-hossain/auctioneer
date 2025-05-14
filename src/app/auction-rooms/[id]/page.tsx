import { notFound } from "next/navigation"
import { getAuctionRoomById } from "@/lib/auction-room"
import { AuctionRoomView } from "@/components/auction/inside-room/auction-room-view"
import { getAuctionChatByRoomId } from "@/lib/auction-room-chat"

interface AuctionRoomPageProps {
  params: {
    id: string
  }
}

export default async function AuctionRoomPage({ params }: AuctionRoomPageProps) {
  const { id } =await params
  // Fetch auction room data
  const auctionRoom = await getAuctionRoomById(id)
  const oldChats = await getAuctionChatByRoomId(id)
  if (!auctionRoom) {
    return notFound()
  }

  return <AuctionRoomView auctionRoom={auctionRoom} oldChats={oldChats} />
}
