// app/components/messaging/conversation-list.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: Array<{
    id: string;
    user: {
      id: string;
      fullName: string | null;
      profileImageUrl: string | null;
      role: string;
    };
    lastMessage: {
      id: string;
      content: string;
      senderId: string;
      createdAt: Date;
    } | null;
    unreadCount: number;
    updatedAt: Date;
  }>;
  activeConversationId?: string | null;
  onSelectConversation: (conversation: any) => void;
  loading: boolean;
  error: string | null;
}

export function ConversationList({ 
  conversations, 
  activeConversationId, 
  onSelectConversation,
  loading,
  error,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No conversations yet. Search for users to start chatting.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeConversationId;
        const lastMessage = conversation.lastMessage;

        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              isActive && "bg-primary/10",
            )}
            onClick={() => onSelectConversation(conversation)}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={conversation.user.profileImageUrl || ""} alt={conversation.user.fullName || ""} />
              <AvatarFallback>
                {conversation.user.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">
                  {conversation.user.fullName || "Unknown User"}
                </h3>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              {lastMessage ? (
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage.senderId === conversation.id ? "" : "You: "}
                    {lastMessage.content}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-primary rounded-full h-2 w-2 flex-shrink-0" />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No messages yet</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}