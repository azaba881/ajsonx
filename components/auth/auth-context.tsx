"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  imageUrl: string
}

type AuthContextType = {
  user: User | null
  isLoaded: boolean
  isSignedIn: boolean
  signIn: () => void
  signOut: () => void
}

const mockUser: User = {
  id: "user_123",
  name: "Paddy Nusantsetrou",
  email: "paddy@example.com",
  imageUrl: "/placeholder.svg?height=32&width=32",
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser)
  const [isLoaded, setIsLoaded] = useState(true)

  const signIn = () => {
    setUser(mockUser)
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

