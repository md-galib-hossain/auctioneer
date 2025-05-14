import { User } from "better-auth/types";

export type AuctionRoomStatus = "live" | "upcoming" | "ended"
interface AuctionItem {
  id: string;
  auctionRoomId: string;
  
  name: string;
  description: string;
  category: string;
  condition: string;
  material: string;
  weight: string;
  dimensions: string;
  origin: string;
  year: string;
  startingPrice: number;
  currentPrice: number | null;
  reservePrice: number | null;
  status: string;
  images: string[];
  createdBy: string;
  creator?: User; 
  winnerId: string | null;
  winner?: User | null; 
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
}

// types/auction.ts
export interface AuctionRoomType {
  id: string;
  title: string;
  description: string;
  items?: AuctionItem[];
 startTime:string;
  endTime: string;


  isPrivate: boolean;
  status: "LIVE" | "UPCOMING" | "ENDED";
  roomCode: string;
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
