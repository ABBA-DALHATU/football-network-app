"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { ConnectionStatus, Role } from "@prisma/client";

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



// new sutff
// app/actions/profile-actions.ts


export const fetchProfileById = async (userId: string) => {
  try {
    const authUser = await currentUser();
    const currentUserId = authUser?.id;

    const user = await db.user.findUnique({
      where: { id: userId },
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
        sentConnections: {
          where: { status: "ACCEPTED" },
          include: { receiver: true },
        },
        receivedConnections: {
          where: { status: "ACCEPTED" },
          include: { sender: true },
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
            { senderId: user.id, receiver: { clerkId: currentUserId } },
            { sender: { clerkId: currentUserId }, receiverId: user.id },
          ],
          status: "ACCEPTED",
        },
      });
      isConnected = !!connection;

      // Calculate mutual connections
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


// connection server actions
export const sendConnectionRequest = async (receiverId: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { status: 401, message: "Unauthorized" };
    }

    const sender = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });
    if (!sender) {
      return { status: 404, message: "User not found" };
    }

    // Check if connection already exists
    const existingConnection = await db.connection.findFirst({
      where: {
        OR: [
          { senderId: sender.id, receiverId },
          { senderId: receiverId, receiverId: sender.id },
        ],
      },
    });

    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        return { 
          status: 400, 
          message: "Connection request already pending" 
        };
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return { 
          status: 400, 
          message: "Already connected with this user" 
        };
      }
      // For rejected connections, we can update the status to PENDING again
      await db.connection.update({
        where: { id: existingConnection.id },
        data: { status: ConnectionStatus.PENDING },
      });
      return { status: 200, message: "Connection request sent" };
    }

    // Create new connection request
    await db.connection.create({
      data: {
        senderId: sender.id,
        receiverId,
        status: ConnectionStatus.PENDING,
      },
    });

    // Create notification for the receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: "CONNECTION_REQUEST",
        content: `${sender.fullName} sent you a connection request`,
      },
    });

    return { status: 201, message: "Connection request sent successfully" };
  } catch (error) {
    console.error("Error sending connection request:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getConnections = async () => {
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

    const connections = await db.connection.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { receiverId: user.id, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
            stats: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
            stats: true,
          },
        },
      },
    });

    // Format connections to show the other user
    const formattedConnections = connections.map((conn) => ({
      id: conn.id,
      user: conn.senderId === user.id ? conn.receiver : conn.sender,
      mutualConnections: 0, // We'll calculate this later
      createdAt: conn.createdAt,
    }));

    // Calculate mutual connections
    const currentUserConnections = connections.map((c) => 
      c.senderId === user.id ? c.receiverId : c.senderId
    );

    for (const connection of formattedConnections) {
      const userConnections = await db.connection.findMany({
        where: {
          OR: [
            { senderId: connection.user.id, status: "ACCEPTED" },
            { receiverId: connection.user.id, status: "ACCEPTED" },
          ],
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      });

      const otherUserConnections = userConnections.map((c) => 
        c.senderId === connection.user.id ? c.receiverId : c.senderId
      );

      connection.mutualConnections = currentUserConnections.filter(id => 
        otherUserConnections.includes(id)
      ).length;
    }

    return { status: 200, data: formattedConnections };
  } catch (error) {
    console.error("Error fetching connections:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getConnectionRequests = async () => {
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

    const incoming = await db.connection.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
            stats: true,
          },
        },
      },
    });

    const outgoing = await db.connection.findMany({
      where: {
        senderId: user.id,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
            role: true,
            stats: true,
          },
        },
      },
    });

    return {
      status: 200,
      data: {
        incoming: incoming.map(req => ({
          id: req.id,
          user: req.sender,
          createdAt: req.createdAt,
        })),
        outgoing: outgoing.map(req => ({
          id: req.id,
          user: req.receiver,
          createdAt: req.createdAt,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const respondToConnectionRequest = async (
  requestId: string,
  accept: boolean
) => {
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

    // Verify the request belongs to the current user
    const request = await db.connection.findUnique({
      where: { id: requestId },
    });

    if (!request || request.receiverId !== user.id) {
      return { status: 403, message: "Not authorized to respond to this request" };
    }

    if (request.status !== "PENDING") {
      return { status: 400, message: "Request has already been processed" };
    }

    const updatedRequest = await db.connection.update({
      where: { id: requestId },
      data: {
        status: accept ? "ACCEPTED" : "REJECTED",
      },
    });

    if (accept) {
      // Create notification for the sender
      await db.notification.create({
        data: {
          userId: request.senderId,
          type: "CONNECTION_ACCEPTED",
          content: `${user.fullName} accepted your connection request`,
        },
      });
    }

    return { status: 200, data: updatedRequest };
  } catch (error) {
    console.error("Error responding to connection request:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const removeConnection = async (connectionId: string) => {
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

    // Verify the connection belongs to the current user
    const connection = await db.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection || 
        (connection.senderId !== user.id && connection.receiverId !== user.id)) {
      return { status: 403, message: "Not authorized to remove this connection" };
    }

    await db.connection.delete({
      where: { id: connectionId },
    });

    return { status: 200, message: "Connection removed successfully" };
  } catch (error) {
    console.error("Error removing connection:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const cancelConnectionRequest = async (requestId: string) => {
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

    // Verify the request belongs to the current user
    const request = await db.connection.findUnique({
      where: { id: requestId },
    });

    if (!request || request.senderId !== user.id) {
      return { status: 403, message: "Not authorized to cancel this request" };
    }

    await db.connection.delete({
      where: { id: requestId },
    });

    return { status: 200, message: "Request cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling connection request:", error);
    return { status: 500, message: "Internal server error" };
  }
};