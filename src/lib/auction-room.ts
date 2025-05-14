// import type { AuctionRoomType } from "@/types/auction"

// // This is a mock function that would be replaced with actual API calls
// export async function getAuctionRoomById(id: string): Promise<AuctionRoomType | null> {
//   // In a real application, you would fetch this data from your API
//   return {
//     id,
//     name: "Vintage Artifacts Auction",
//     description: "Auction for rare and vintage collectibles",
//     status: "live",
//     isPrivate: true,
//     password: "secret",
//     participants: Array.from({ length: 20 }, (_, i) => ({
//       id: `user${i + 1}`,
//       name: `User ${i + 1}`,
//     })),
//     startTime: new Date(Date.now() - 3600000), // 1 hour ago
//     endsAt: new Date(Date.now() + 3600000), // 1 hour from now
//     currentBid: 750,
//     currency: "$",
//     items: [
//       {
//         id: "1",
//         name: "Vintage Pocket Watch",
//         description:
//           "A rare 19th century gold-plated pocket watch with intricate engravings and fully functional mechanism.",
//         startingPrice: 500,
//         currentPrice: 750,
//         images: ["/auction-item.jpg"],
//         status: "active",
//       },
//     ],
//   }
// }

import type { AuctionRoomType } from "@/types/auction"
import axiosInstance from "./axios-config"

// This is a mock function that would be replaced with actual API calls
export async function getAuctionRoomById(id: string): Promise<AuctionRoomType | null> {
  // In a real application, you would fetch this data from your API
const response = await axiosInstance.get(`/auction-room/${id}`)
const room = response.data.data
 return room
}
