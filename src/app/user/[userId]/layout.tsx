import type React from "react";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata = {
  title: "FootNet - Football Networking App",
  description: "Connect with football players and teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
