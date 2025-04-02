// app/actions/post-actions.ts
"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

export const fetchPosts = async (
  page = 1,
  limit = 10,
  feedType = "your-feed"
) => {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { status: 401, message: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: authUser.id },
      include: {
        sentConnections: {
          where: { status: "ACCEPTED" },
          select: { receiverId: true },
        },
        receivedConnections: {
          where: { status: "ACCEPTED" },
          select: { senderId: true },
        },
      },
    });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Get IDs of connected users
    const connectedUserIds = [
      ...user.sentConnections.map((c) => c.receiverId),
      ...user.receivedConnections.map((c) => c.senderId),
      user.id, // Include own posts
    ];

    const whereClause =
      feedType === "your-feed" ? { userId: { in: connectedUserIds } } : {};

    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
            stats: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      status: 200,
      data: posts.map((post) => ({
        ...post,
        likeCount: post.likes.length,
        commentCount: post.comments.length,
      })),
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const createPost = async (content: string, imageUrl?: string) => {
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

    const newPost = await db.post.create({
      data: {
        userId: user.id,
        content,
        imageUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
          },
        },
        likes: true,
        comments: true,
      },
    });

    return {
      status: 201,
      data: {
        ...newPost,
        likeCount: 0,
        commentCount: 0,
      },
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const likePost = async (postId: string) => {
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

    // Check if already liked
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { status: 200, action: "unliked" };
    } else {
      // Like the post
      await db.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
      return { status: 200, action: "liked" };
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const addComment = async (postId: string, content: string) => {
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

    const newComment = await db.comment.create({
      data: {
        postId,
        userId: user.id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return {
      status: 201,
      data: {
        ...newComment,
        timestamp: newComment.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const requestConnection = async (receiverId: string) => {
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

    // Check if connection already exists
    const existingConnection = await db.connection.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId },
          { senderId: receiverId, receiverId: user.id },
        ],
      },
    });

    if (existingConnection) {
      return {
        status: 400,
        message:
          existingConnection.status === "PENDING"
            ? "Connection request already pending"
            : "You are already connected",
      };
    }

    const newConnection = await db.connection.create({
      data: {
        senderId: user.id,
        receiverId,
        status: "PENDING",
      },
    });

    return { status: 201, data: newConnection };
  } catch (error) {
    console.error("Error requesting connection:", error);
    return { status: 500, message: "Internal server error" };
  }
};

