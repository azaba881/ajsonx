import { ApiManagement } from "@/components/dashboard/api-management"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats />
      <ApiManagement />
    </div>
  )
}

