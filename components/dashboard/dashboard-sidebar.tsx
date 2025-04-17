"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, CreditCard, Settings, LogOut, Plus } from "lucide-react"
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
import { SignOutButton } from "@clerk/nextjs"

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
          <div className="relative w-[100px] h-auto mb-8">
            <Image 
              src="/logo-dark.png"
              alt="logo-dark"
              width={200}  
              height={150}
              className="light:hidden absolute " 
            />
            <Image 
              src="/logo-light.png"
              alt="logo-light"
              width={200}  
              height={150}
              className="dark:hidden absolute" 
            />
          </div>
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
            <SignOutButton>
              <Button variant="ghost">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

