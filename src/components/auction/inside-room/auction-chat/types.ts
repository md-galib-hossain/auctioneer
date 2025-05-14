export interface IChatMessage {
  id: string;
  content: string;
  user: { id: string; name: string; role: string; email: string; emailVerified: boolean; image: string | null };
  userId: string;
  createdAt: string;
  isSystem: boolean;
}