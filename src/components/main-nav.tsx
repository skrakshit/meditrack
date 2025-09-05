import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Calendar, LayoutDashboard, Stethoscope, List, CreditCard, FlaskConical, UserPlus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DailyStats } from "./daily-stats";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
   {
    href: "/dashboard/opd",
    label: "OPD Registration",
    icon: UserPlus,
  },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    href: "/dashboard/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    href: "/dashboard/doctors/master-list",
    label: "Doctor Master List",
    icon: List,
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    href: "/dashboard/lab-appointments",
    label: "Lab Appointments",
    icon: FlaskConical,
  },
];

export function MainNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for the main dashboard page
    if (href === "/dashboard") {
      return pathname === href;
    }
    // For other pages, check if the pathname starts with the href,
    // but also ensure it's not a parent of a more specific active route.
    // For example, if on /dashboard/doctors/master-list, /dashboard/doctors should not be active.
    const isParentOfActive = menuItems.some(item => 
        pathname.startsWith(item.href) && 
        item.href.length > href.length && 
        href !== '/dashboard' &&
        item.href.startsWith(href)
    );

    return pathname.startsWith(href) && !isParentOfActive;
  };

  return (
    <>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={isActive(item.href)}
                className={cn("w-full justify-start")}
                tooltip={item.label}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <div className="p-2 group-data-[collapsible=icon]:hidden">
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-xs font-semibold uppercase text-muted-foreground hover:no-underline rounded-md px-2 hover:bg-sidebar-accent">
                    Daily Stats
                </AccordionTrigger>
                <AccordionContent className="p-2">
                    <DailyStats />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
