"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

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
    });

    if (existingUser) {
      return { status: 200, data: existingUser }; // Return existing user
    }

    const newUser = await db.user.create({
      data: {
        fullName: authUser.fullName || "",
        email: authUser.emailAddresses[0]?.emailAddress || "",
        role: "NONE",
        clerkId: authUser.id,
      },
    });

    return { status: 201, data: newUser }; // Return newly created user
  } catch (error) {
    console.error("Error during user authentication:", error);
    return { status: 500, message: "Internal server error." }; // Handle errors gracefully
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
