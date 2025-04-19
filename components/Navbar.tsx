"use client"

import { useTheme } from "next-themes" // Importez useTheme
import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { Globe, Moon, Sun, User, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "./ui/button"
import { useState } from "react"

const Navbar = () => {
  // Utilisez le hook useTheme pour obtenir le thème actuel et la fonction pour le changer
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5 mt-4">
      <Link href="/">
        <Image src="/logo-light.png" alt="logo-light" width={150} height={89} className="block dark:hidden" />
        <Image src="/logo-dark.png" alt="logo-dark" width={150} height={89} className="hidden dark:block" />
      </Link>
      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.key} className="regular-16 hover:text-[#ea580c] text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flexCenter hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Français</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Español</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bouton pour basculer entre les thèmes sombre et clair */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border-[1.5px] dark:border-white mx-2 dark:bg-gray-50 bg-white border-black">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Link href="/sign-up">Sign up</Link></DropdownMenuItem>
            <DropdownMenuItem><Link href="/sign-in">Sign in</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Menu mobile */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay et menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image src="/logo-light.png" alt="logo-light" width={150} height={89} className="block dark:hidden" />
                  <Image src="/logo-dark.png" alt="logo-dark" width={150} height={89} className="hidden dark:block" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link 
                    href={link.href} 
                    key={link.key} 
                    className="regular-16 hover:text-[#ea580c] text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                  <span>Toggle theme</span>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="rounded-full border-[1.5px] dark:border-white dark:bg-gray-50 bg-white border-black">
                    <User className="h-5 w-5" />
                  </Button>
                  <div className="flex flex-col">
                    <Link href="/sign-up" className="hover:text-[#ea580c]" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                    <Link href="/sign-in" className="hover:text-[#ea580c]" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar