"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Film,
  Tv,
  Users,
  CreditCard,
  Radio,
  BarChart3,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    url: "/admin/content",
    icon: Play,
    isActive: true,
    items: [
      {
        title: "Movies",
        url: "/admin/content/movies",
        icon: Film,
      },
      {
        title: "TV Shows",
        url: "/admin/content/series",
        icon: Tv,
      },
      {
        title: "Episodes",
        url: "/admin/content/episodes",
        icon: Radio,
      },
    ],
  },
  {
    title: "Management",
    url: "/admin/management",
    icon: Users,
    items: [
      {
        title: "Users",
        url: "/admin/management/users",
        icon: Users,
      },
      {
        title: "Subscriptions",
        url: "/admin/management/subscriptions",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Engagement",
    url: "/admin/engagement",
    icon: Star,
    items: [
      {
        title: "Analytics",
        url: "/admin/engagement/analytics",
        icon: BarChart3,
      },
      {
        title: "Reviews",
        url: "/admin/engagement/reviews",
        icon: Star,
      },
    ],
  },
  {
    title: "Live TV & Sports",
    url: "/admin/live",
    icon: Radio,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-200 bg-white text-zinc-900"
      {...props}
    >
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-lg">
            <Play className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
            StreamHub
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 font-bold px-6 py-4 uppercase text-[10px] tracking-widest opacity-80">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  item.items?.some((sub) => pathname === sub.url);

                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            className={cn(
                              "w-full justify-between hover:bg-indigo-50 hover:text-indigo-600 transition-all text-zinc-700",
                              isActive &&
                                "bg-indigo-50 text-indigo-600 font-semibold",
                            )}
                          >
                            <Link
                              href={item.url}
                              className="flex w-full items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <item.icon
                                  className={cn(
                                    "h-4 w-4",
                                    isActive
                                      ? "text-indigo-600"
                                      : "text-zinc-500",
                                  )}
                                />
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90",
                                  isActive
                                    ? "text-indigo-600"
                                    : "text-zinc-400",
                                )}
                              />
                            </Link>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link
                                    href={subItem.url}
                                    className="flex items-center gap-3 w-full"
                                  >
                                    <subItem.icon
                                      className={cn(
                                        "h-4 w-4 shrink-0",
                                        pathname === subItem.url
                                          ? "text-indigo-600"
                                          : "text-zinc-400",
                                      )}
                                    />
                                    <span
                                      className={cn(
                                        "truncate",
                                        pathname === subItem.url
                                          ? "text-indigo-600 font-medium"
                                          : "text-zinc-600",
                                      )}
                                    >
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      className={cn(
                        "hover:bg-indigo-50 hover:text-indigo-600 transition-all text-zinc-700",
                        pathname === item.url &&
                          "bg-indigo-50 text-indigo-600 font-semibold",
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            pathname === item.url
                              ? "text-indigo-600"
                              : "text-zinc-500",
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-200 p-2 bg-white">
        <SidebarMenu>
          {settingsItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="hover:bg-red-50 hover:text-red-600 transition-colors text-zinc-600"
              >
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
