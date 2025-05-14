"use client";

import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";

interface ConnectionErrorProps {
  error: string | null;
  onRetry: () => void;
  socket: Socket | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ConnectionError = ({ error, onRetry, socket }: ConnectionErrorProps) => {
  if (!error) return null;
  return (
    <div className="p-3 text-red-600 text-sm bg-red-50 flex justify-between items-center">
      {error}
      <Button size="sm" onClick={() => socket?.connect()}>
        Retry Now
      </Button>
    </div>
  );
};