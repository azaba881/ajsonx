"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, CreditCard, Settings, LogOut, Database, Plus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Pricing",
      href: "/dashboard/pricing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleCreateApi = () => {
    router.push("/dashboard/create-api")
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center gap-2">
          {/* <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AjsonX</span> */}
          <Image src="/logo-dark.png"
          alt="logo-dark"
          width={100}  
          height={100}
          className="w-auto light:hidden"
          />
          <Image src="/logo-light.png"
          alt="camp"
          width={100}  
          height={100}
          className="dark:hidden"
          />
        </Link>
      </SidebarHeader>  
      <SidebarContent>
        <div className="px-3 py-2">
          <Button className="w-full  my-4 py-2" onClick={handleCreateApi}>
            <Plus className="mr-2 h-4 w-4" />
            Create New API
          </Button>
        </div>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout" onClick={signOut}>
              <button className="w-full">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

