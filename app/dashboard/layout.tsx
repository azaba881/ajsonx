"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthProvider } from "@/components/auth/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <DashboardSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}

