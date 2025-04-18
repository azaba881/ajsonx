"use client"

import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { User, Lock, Mail, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  firstName: string
  lastName: string
  username: string
  bio: string
  profileImage: string
  emailAddress: string
  phoneNumber: string
}

export default function SettingsPage() {
  const { user, isLoaded: userLoaded } = useUser()
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    profileImage: "",
    emailAddress: "",
    phoneNumber: ""
  })

  useEffect(() => {
    if (userLoaded && user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        bio: "",
        profileImage: user.imageUrl || "",
        emailAddress: user.primaryEmailAddress?.emailAddress || "",
        phoneNumber: user.primaryPhoneNumber?.phoneNumber || ""
      })

      // Charger les données supplémentaires depuis notre API
      loadUserData()
    }
  }, [userLoaded, user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const token = await getToken()
      const response = await fetch("/api/settings/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({
          ...prev,
          bio: data.bio || ""
        }))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setIsLoading(true)
      await user.setProfileImage({
        file,
      })
      
      setProfile(prev => ({
        ...prev,
        profileImage: user.imageUrl || ""
      }))
      
      toast.success("Photo de profil mise à jour")
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la photo:", error)
      toast.error("Erreur lors de la mise à jour de la photo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      // Mise à jour des informations dans Clerk
      if (profile.firstName !== user.firstName || profile.lastName !== user.lastName) {
        await user.update({
          firstName: profile.firstName,
          lastName: profile.lastName
        })
      }

      // Mise à jour de la bio dans notre base de données
      const token = await getToken()
      const response = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: profile.bio
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour du profil")
      }

      toast.success("Profil mis à jour avec succès")
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error)
      toast.error(error.message || "Erreur lors de la mise à jour du profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = '/sign-in?reset_password=true'
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et informations personnelles</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center mx-8 gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Compte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleProfileSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles et votre photo de profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.profileImage} alt="Photo de profil" />
                        <AvatarFallback>
                          {profile.firstName?.[0]}{profile.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center gap-2">
                        <Label
                          htmlFor="profile-image"
                          className="cursor-pointer text-sm font-medium text-primary hover:underline"
                        >
                          Changer la photo
                        </Label>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile({ ...profile, firstName: e.target.value })
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile({ ...profile, lastName: e.target.value })
                            }
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                      

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="email"
                            type="email"
                            value={profile.emailAddress}
                            disabled
                            className="bg-gray-50"
                          />                          
                        </div>
                      </div>

                      {/* <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="phone"
                            type="tel"
                            value={profile.phoneNumber}
                            disabled
                            className="bg-gray-50"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.location.href = '/user/settings/phone'}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Gérer
                          </Button>
                        </div>
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          placeholder="Parlez-nous de vous..."
                          className="min-h-[100px]"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="account">
            <form onSubmit={handlePasswordSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte et modifiez votre mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                    <p className="text-sm text-muted-foreground">
                      Un email vous sera envoyé pour réinitialiser votre mot de passe
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    Réinitialiser le mot de passe
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

