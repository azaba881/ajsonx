import { ArrowUpRight, Users, Database, Server } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="text-emerald-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              12%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">API Requests</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="text-emerald-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              18%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Free</div>
          <p className="text-xs text-muted-foreground mt-1">20 APIs limit (4/20 used)</p>
        </CardContent>
      </Card>
    </div>
  )
}

