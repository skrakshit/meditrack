
"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { UserProvider } from "@/hooks/use-user";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <UserProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar collapsible="icon">
            <SidebarHeader className="p-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <span className="font-bold text-lg font-headline">MediTrack</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
              {/* Footer content if any */}
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          <SidebarInset className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
              <SidebarTrigger className="md:hidden" />
              <div className="ml-auto">
                <UserNav />
              </div>
            </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
