// app/actions/messaging-actions.ts
"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export const getConversations = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { status: 401, message: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Get all conversations where the current user is either sender or receiver
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group messages by conversation (other user)
    const conversationsMap = new Map<string, any>();
    
    for (const message of messages) {
      const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
      const otherUser = message.senderId === user.id ? message.receiver : message.sender;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId,
          user: otherUser,
          messages: [],
          unreadCount: 0,
        });
      }
      
      const conversation = conversationsMap.get(otherUserId);
      conversation.messages.push(message);
      
      // Count unread messages
      if (message.receiverId === user.id && !message.readAt) {
        conversation.unreadCount++;
      }
    }

    // Convert map to array and format conversations
    const conversations = Array.from(conversationsMap.values()).map(conv => ({
      id: conv.id,
      user: conv.user,
      lastMessage: conv.messages[0], // Most recent message
      unreadCount: conv.unreadCount,
      updatedAt: conv.messages[0].createdAt,
    }));

    return { status: 200, data: conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getMessages = async (otherUserId: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { status: 401, message: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Get all messages between current user and other user
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Mark messages as read
    await db.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: user.id,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { status: 200, data: messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const sendMessage = async (receiverId: string, content: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { status: 401, message: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Check if receiver exists
    const receiver = await db.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      return { status: 404, message: "Receiver not found" };
    }

    // Create new message
    const message = await db.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Create notification for the receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: "MESSAGE",
        content: `New message from ${user.fullName}`,
      },
    });

    return { status: 201, data: message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { status: 401, message: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const users = await db.user.findMany({
      where: {
        id: { not: user.id }, // Exclude current user
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        profileImageUrl: true,
        email: true,
        role: true,
      },
      take: 10, // Limit results
    });

    return { status: 200, data: users };
  } catch (error) {
    console.error("Error searching users:", error);
    return { status: 500, message: "Internal server error" };
  }
};