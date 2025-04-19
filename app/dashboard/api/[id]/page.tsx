import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Database, Plus, Trash2, Edit2, Copy } from "lucide-react"
import ApiClient from "./client"

interface Props {
  params: {
    id: string
  }
}

export default function ApiDetailPage({ params }: Props) {
  return <ApiClient id={params.id} />
}