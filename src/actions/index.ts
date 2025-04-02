"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

//   id            String   @id @default(uuid())
//   email         String   @unique
//   name          String?
//   profileImage  String?
//   role          Role
//   bio           String?
//   preferredFoot String? // Left, Right, Both
//   formerClub    String?
//   createdAt     DateTime @default(now())
//   updatedAt     DateTime @updatedAt()
export const onAuthenticateUser = async () => {
  try {
    const authUser = await currentUser();

    if (!authUser) {
      return { status: 404, message: "User not authenticated." };
    }

    const existingUser = await db.user.findUnique({
      where: { clerkId: authUser.id },
      include: { stats: true },
    });

    if (existingUser) {
      return { status: 200, data: existingUser };
    }

    const newUser = await db.user.create({
      data: {
        fullName: authUser.fullName || "",
        email: authUser.emailAddresses[0]?.emailAddress || "",
        role: "NONE",
        clerkId: authUser.id,
        stats: {
          create: {
            goals: 0,
            assists: 0,
            matches: 0,
            minutes: 0,
          },
        },
      },
      include: {
        stats: true,
      },
    });

    return { status: 201, data: newUser };
  } catch (error) {
    console.error("Error during user authentication:", error);
    return { status: 500, message: "Internal server error." };
  }
};

export const getUserByClerkId = async () => {
  const authUser = await currentUser();

  if (!authUser) {
    return { status: 404, message: "User not authenticated." };
  }

  const user = await db.user.findUnique({
    where: { clerkId: authUser.id },
  });

  if (!user) {
    return { status: 404, message: "User not found." };
  }

  return { status: 200, data: user }; // Return found user
};

//////////////////////

// app/actions/profile-actions.ts

export const fetchProfile = async () => {
  try {
    const authUser = await currentUser();
    const currentUserId = authUser?.id;

    const user = await db.user.findUnique({
      where: { clerkId: currentUserId },
      include: {
        stats: true,
        posts: {
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
            },
          },
          orderBy: { createdAt: "desc" },
        },
        sentConnections: true,
        receivedConnections: true,
        _count: {
          select: {
            posts: true,
            sentConnections: {
              where: { status: "ACCEPTED" },
            },
            receivedConnections: {
              where: { status: "ACCEPTED" },
            },
          },
        },
      },
    });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Check connection status if not viewing own profile
    let isConnected = false;
    let mutualConnections = 0;

    if (currentUserId && user.clerkId !== currentUserId) {
      const connection = await db.connection.findFirst({
        where: {
          OR: [
            { senderId: user.id, receiverId: currentUserId },
            { senderId: currentUserId, receiverId: user.id },
          ],
        },
      });
      isConnected = connection?.status === "ACCEPTED";

      // Calculate mutual connections (simplified example)
      if (isConnected) {
        const currentUserData = await db.user.findUnique({
          where: { clerkId: currentUserId },
          select: {
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

        if (currentUserData) {
          const currentUserConnections = [
            ...currentUserData.sentConnections.map((c) => c.receiverId),
            ...currentUserData.receivedConnections.map((c) => c.senderId),
          ];

          const profileConnections = [
            ...user.sentConnections.map((c) => c.receiverId),
            ...user.receivedConnections.map((c) => c.senderId),
          ];

          mutualConnections = currentUserConnections.filter((id) =>
            profileConnections.includes(id)
          ).length;
        }
      }
    }

    return {
      status: 200,
      data: {
        user,
        isOwnProfile: user.clerkId === currentUserId,
        isConnected,
        mutualConnections,
      },
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
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

    const newMessage = await db.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
      },
    });

    return { status: 201, data: newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// app/actions/profile-actions.ts
export const updateUserProfile = async (
  userId: string,
  data: {
    fullName?: string;
    role?: string;
    bio?: string | null;
    preferredFoot?: string | null;
    formerClub?: string | null;
  }
) => {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        role: data.role as Role,
        bio: data.bio,
        preferredFoot: data.preferredFoot,
        formerClub: data.formerClub,
      },
      include: {
        stats: true,
      },
    });

    return { status: 200, data: updatedUser };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const addUserRole = async (role: Role) => {
  const authUser = await currentUser();
  if (!authUser) return;

  // Check if the user exists
  const user = await db.user.findUnique({
    where: { clerkId: authUser.id },
  });

  if (!user) {
    console.error("User not found for clerkId:", authUser.id);
    return { status: 404, message: "User not found" }; // Handle user not found
  }

  // Proceed to update the user role
  const res = await db.user.update({
    where: { clerkId: authUser.id },
    data: {
      role,
    },
  });

  return res;
};
