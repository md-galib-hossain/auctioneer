import { notFound } from "next/navigation";
import { getAuctionRoomById } from "@/lib/auction-room";
import { AuctionRoomView } from "@/components/auction/inside-room/auction-room-view";
import { getAuctionChatByRoomId } from "@/lib/auction-room-chat";

interface AuctionRoomPageProps {
  params: {
    id: string;
  };
}

export default async function AuctionRoomPage({ params }: AuctionRoomPageProps) {
  const { id } =await params;
  const auctionRoom = await getAuctionRoomById(id);
  const chatResponse = await getAuctionChatByRoomId(id);

  if (!auctionRoom || !chatResponse) {
    return notFound();
  }

  const { meta, data: oldChats } = chatResponse;

  return <AuctionRoomView auctionRoom={auctionRoom} oldChats={oldChats} initialMeta={meta} />;
}