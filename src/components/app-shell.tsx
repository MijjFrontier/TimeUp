"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  UserCircle,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/tasks", label: "Tareas", icon: CheckSquare },
  { href: "/schedule", label: "Horario", icon: CalendarDays },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <div className="w-full p-2">
             <SidebarMenuButton asChild>
                <Link href="#">
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </Link>
             </SidebarMenuButton>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
           <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-xl font-bold font-headline md:text-2xl">
                {navItems.find(item => item.href === pathname)?.label || 'Panel'}
             </h1>
           </div>
           <div className="flex items-center gap-4">
             <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt="@student" data-ai-hint="person face" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
           </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
