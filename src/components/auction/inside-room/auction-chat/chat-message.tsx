"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { IChatMessage } from "./types";
import { authClient } from "@/lib/auth-client";

interface ChatMessageProps {
  message: IChatMessage;
}

export const ChatMessage = React.memo(({ message }: ChatMessageProps) => {
  const { data: session } = authClient.useSession();
  const ownMessage = message.userId === session?.user?.id;
  // console.log("Rendering ChatMessage:", { messageId: message.id, ownMessage, userId: message.userId, sessionUserId: session?.user?.id }); // Debug log

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 mt-0.5">
        <AvatarImage src={message.user.image ?? "/placeholder.svg?height=32&width=32"} alt={message.user.name} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message.user.name}</span>
          {message.user.role !== "user" && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                message.user.role === "admin"
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-blue-50 text-blue-600 border-blue-200"
              )}
            >
              {message.user.role === "admin" ? "Admin" : "Superadmin"}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
        </div>
        <p
          className={cn(
            "text-sm mt-0.5",
            message.user.role !== "user" ? "text-rose-600" : "text-foreground"
          )}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";