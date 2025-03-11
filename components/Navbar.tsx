import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import Button from "./Button"

const Navbar = () => {
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
        
        <Button    
          type="button"
          title="Login"  
          icon="/user.svg"
          variant="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition duration-300"
        />
      </div>

      <Image 
        src="menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
      />
    </nav>
  )
}

export default Navbar