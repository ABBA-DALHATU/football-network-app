import type React from "react";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata = {
  title: "FootNet - Football Networking App",
  description: "Connect with football players and teams",
};

export default function RootLayout({
  params: { userId },
  children,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  return <AppLayout userId={userId}>{children}</AppLayout>;
}
