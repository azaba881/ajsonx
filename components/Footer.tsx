import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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
            <FooterColumn title={''}>
                  <ul className="regular-14 flex gap-4 text-gray-30">
                    {SOCIALS.links.map((link) => (
                      <Link href="/" key={link}>
                        <Image className='rounded-full' src={link} alt="logo" width={40} height={40} />
                      </Link>
                    ))}
                  </ul>
            </FooterColumn>
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
                    className="flex gap-4 md:flex-col lg:flex-row"
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