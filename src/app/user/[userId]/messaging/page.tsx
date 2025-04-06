// app/messaging/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ConversationList } from "@/components/messaging/conversation-list";
import { MessageThread } from "@/components/messaging/message-thread";
import { MessageInput } from "@/components/messaging/message-input";
import { UserSearch } from "@/components/messaging/user-search";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { getConversations, getMessages, sendMessage, searchUsers } from "@/actions/messaging-actions";
import { useRouter } from "next/navigation";

export default function MessagingPage() {
  const { isMobile } = useSidebar();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [showConversations, setShowConversations] = useState(!isMobile);
  const [loading, setLoading] = useState({
    conversations: true,
    messages: true,
  });
  const [error, setError] = useState({
    conversations: null,
    messages: null,
  });
  const router = useRouter();

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(prev => ({ ...prev, conversations: true }));
        const result = await getConversations();
        if (result.status === 200) {
          setConversations(result.data);
        } else {
          setError(prev => ({ ...prev, conversations: result.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, conversations: "Failed to load conversations" }));
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    loadConversations();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const loadMessages = async () => {
      try {
        setLoading(prev => ({ ...prev, messages: true }));
        const result = await getMessages(activeConversation.id);
        if (result.status === 200) {
          setMessages(result.data);
        } else {
          setError(prev => ({ ...prev, messages: result.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, messages: "Failed to load messages" }));
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    loadMessages();
  }, [activeConversation]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setShowConversations(!isMobileView || (isMobileView && !activeConversation));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [activeConversation]);

  // Select a conversation
  const handleSelectConversation = (conversation: any) => {
    setActiveConversation(conversation);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  // Start a new conversation with a user
  const handleStartConversation = async (user: any) => {
    // Check if conversation already exists
    const existingConversation = conversations.find((conv) => conv.user.id === user.id);

    if (existingConversation) {
      handleSelectConversation(existingConversation);
      return;
    }

    // Create a new conversation object
    const newConversation = {
      id: user.id,
      user,
      lastMessage: null,
      updatedAt: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    handleSelectConversation(newConversation);
  };

  // Send a new message
  const handleSendMessage = async (content: string) => {
    if (!activeConversation || !content.trim()) return;

    try {
      const result = await sendMessage(activeConversation.id, content);
      if (result.status === 201) {
        // Add the new message to the current messages
        setMessages(prev => [...prev, result.data]);

        // Update the conversation in the list
        setConversations(prev => {
          const updated = prev.map(conv => 
            conv.id === activeConversation.id 
              ? { ...conv, lastMessage: result.data, updatedAt: new Date() } 
              : conv
          );
          // Sort by most recent
          return updated.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        // Update the active conversation
        setActiveConversation(prev => ({
          ...prev,
          lastMessage: result.data,
          updatedAt: new Date(),
        }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Back to conversation list on mobile
  const handleBackToList = () => {
    setShowConversations(true);
  };

  // Search for users
  const handleSearchUsers = async (query: string) => {
    try {
      const result = await searchUsers(query);
      if (result.status === 200) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to search users:", error);
      return [];
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-4 pb-2 px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
          {isMobile && activeConversation && !showConversations && (
            <Button variant="ghost" size="sm" onClick={handleBackToList} className="md:hidden">
              Back to conversations
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        {showConversations && (
          <div className="w-full md:w-80 border-r flex flex-col pt-10">
            <div className="p-4">
              <UserSearch 
                onSearch={handleSearchUsers} 
                onSelectUser={handleStartConversation} 
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversation?.id}
                onSelectConversation={handleSelectConversation}
                loading={loading.conversations}
                error={error.conversations}
              />
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className={`flex-1 flex flex-col ${!showConversations ? "block" : "hidden md:flex"}`}>
          {activeConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                <MessageThread 
                  messages={messages} 
                  currentUserId={activeConversation.user.id} 
                  loading={loading.messages}
                  error={error.messages}
                />
              </div>
              <div className="border-t p-4">
                <MessageInput onSendMessage={handleSendMessage} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose an existing conversation or search for a user to start a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}