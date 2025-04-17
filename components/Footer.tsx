import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants'
import { Separator } from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button as PrimaryButton } from './ui/button'

const Footer = () => {
  return (
    <footer className="flexCenter my-6">
      <div className="padding-container max-container flex w-full flex-col gap-14">
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
          <div className='flex flex-col'>
            <Link href="/" className="mb-10">
              <Image src="/logo-light.png" alt="logo-light" width={150} height={150} className="block dark:hidden" />
              <Image src="/logo-dark.png" alt="logo-dark" width={150} height={150} className="hidden dark:block" />
            </Link>   
            <div>
                <h3 className="font-medium mb-2">Social media</h3>
                <div className="flex space-x-4">
                    <PrimaryButton className='hover:bg-[#EA580C]' variant="outline" size="icon">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </PrimaryButton>
                    <Link href='/'>
                      <PrimaryButton className='hover:bg-[#EA580C]' variant="outline" size="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </PrimaryButton>
                    </Link>                    
                    <PrimaryButton className='hover:bg-[#EA580C]' variant="outline" size="icon">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </PrimaryButton>
                  </div>
                </div> 
          </div>
          <div className='flex flex-wrap gap-10 sm:justify-between md:flex-1'>
          {FOOTER_LINKS.map((column, index) => (
            <FooterColumn title={column.title} key={index}>
              <ul className="regular-14 flex flex-col gap-4 text-gray-30">
                {column.links.map(({ label, url }) => (
                  <Link href={url} key={url} className="hover:text-[#EA580C]">
                    {label}
                  </Link>
                ))}
              </ul>
            </FooterColumn>
          ))}

            <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    href="/"
                    key={link.label}
                    className="flex gap-2 md:flex-col lg:flex-row"
                  >
                    <p className="whitespace-nowrap text-gray-20">
                      {link.label}:
                    </p>
                    <p className="text-gray-20">
                      {link.value}
                    </p>
                  </Link>
                ))}
              </FooterColumn>                  
            </div>               
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 AjsonX. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
        {/* <hr className='m-0 border-orange-200 border-[0.2]' />
        <p className="regular-14 w-full text-center text-gray-30">© 2024 AjsonX | All rights reserved</p> */}
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap text-white">{title}</h4>
      {children}
    </div>
  )
}

export default Footer