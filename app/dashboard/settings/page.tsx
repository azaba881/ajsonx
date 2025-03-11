import { SettingsForm } from "@/components/dashboard/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your account settings and preferences</p>
      <SettingsForm />
    </div>
  )
}

