import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Database, Plus, Trash2, Edit2, Copy } from "lucide-react"
import { use } from "react"
import ApiClient from "./client"

interface Props {
  params: {
    id: string
  }
}

export default function ApiDetailPage({ params }: Props) {
  const id = use(Promise.resolve(params.id))
  
  return <ApiClient id={id} />
}

