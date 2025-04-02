"use client";

import {
  Home,
  MessageSquare,
  Users,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const sidebarItems = [
    {
      title: "Feed",
      href: `/user/${userId}/feed`,
      icon: Home,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Messaging",
      href: `/user/${userId}/messaging`,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Connections",
      href: `/user/${userId}/connections`,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Profile",
      href: `/user/${userId}/profile`,
      icon: User,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Settings",
      href: `/user/${userId}/settings`,
      icon: Settings,
      color: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-gray-800/50",
    },
  ];

  return (
    <ShadcnSidebar
      collapsible="icon"
      className="border-r border-border/50 shadow-sm z-20"
    >
      <SidebarHeader className="flex items-center justify-between p-5 border-b border-border/50">
        <div className="flex items-center gap-3 font-bold text-xl">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-md">
            F
          </div>
          <span className="tracking-tight">FootNet</span>
        </div>
        <SidebarTrigger className="h-9 w-9" />
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="h-12 text-base font-medium transition-all hover:translate-x-1"
              >
                <NextLink
                  href={item.href}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bgColor} ${item.color} mr-3 transition-transform group-hover:scale-110`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span>{item.title}</span>
                </NextLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="h-12 text-base font-medium transition-all hover:translate-x-1"
            >
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-500 dark:bg-red-900/30 mr-3 transition-transform group-hover:scale-110">
                  <LogOut className="h-5 w-5" />
                </div>
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
