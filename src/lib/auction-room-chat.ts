

import axiosInstance from "./axios-config"
import { IChatMessage } from "@/components/auction/inside-room/auction-chat/types"

// This is a mock function that would be replaced with actual API calls
export async function getAuctionChatByRoomId(id: string): Promise<IChatMessage[] | null> {
  // In a real application, you would fetch this data from your API
const response = await axiosInstance.get(`/chat?auctionRoomId=${id}`)
const room = response.data.data
 return room
}
