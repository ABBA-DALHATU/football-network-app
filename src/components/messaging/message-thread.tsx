// app/components/messaging/message-thread.tsx
"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageThreadProps {
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    sender: {
      id: string;
      fullName: string | null;
      profileImageUrl: string | null;
    };
  }>;
  currentUserId: string;
  loading: boolean;
  error: string | null;
}

export function MessageThread({ messages, currentUserId, loading, error }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "flex items-end gap-2 max-w-[80%]",
              i % 2 === 0 ? "ml-auto" : "mr-auto"
            )}
          >
            {i % 2 !== 0 && (
              <Skeleton className="h-8 w-8 rounded-full" />
            )}
            <Skeleton className={cn(
              "h-12 rounded-2xl",
              i % 2 === 0 ? "w-3/4" : "w-2/3"
            )} />
            {i % 2 === 0 && (
              <Skeleton className="h-8 w-8 rounded-full" />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-muted-foreground">Start the conversation by sending a message below.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => {
        const isSentByMe = message.senderId === currentUserId;

        return (
          <div 
            key={message.id} 
            className={cn(
              "flex items-end gap-2 max-w-[80%]",
              isSentByMe ? "ml-auto" : "mr-auto"
            )}
          >
            {!isSentByMe && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender.profileImageUrl || ""} alt={message.sender.fullName || ""} />
                <AvatarFallback>
                  {message.sender.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-2xl px-4 py-2 break-words",
                isSentByMe ? "bg-primary text-primary-foreground" : "bg-muted border border-border/50",
              )}
            >
              <p>{message.content}</p>
              <div className={cn(
                "text-xs mt-1", 
                isSentByMe ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {format(new Date(message.createdAt), "h:mm a")}
              </div>
            </div>
            {isSentByMe && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/placeholder.svg" alt="You" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}