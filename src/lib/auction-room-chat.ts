import axiosInstance from "./axios-config";
import { IChatMessage } from "@/components/auction/inside-room/auction-chat/types";
import { IMeta } from "@/lib/interface";

interface AuctionChatResponse {
  meta: IMeta;
  data: IChatMessage[];
}

export async function getAuctionChatByRoomId(id: string): Promise<AuctionChatResponse | null> {
  try {
    const response = await axiosInstance.get(`/chat?auctionRoomId=${id}&limit=15`);
    const { meta, data } = response.data;
    return { meta, data };
  } catch (error) {
    console.error("Error fetching auction chat:", error);
    return null;
  }
}