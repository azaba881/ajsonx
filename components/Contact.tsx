import React from 'react'
import Button from './Button'
import Image from 'next/image'

const Contact = () => {
  return (
    <section className="flexCenter w-full flex-col pb-[100px]">
      <div className="get-app">
        <div className="flex flex-1 items-center justify-end">
          <Image src="/contact.svg" alt="contact us" width={550} height={870} />
        </div>
        <div className="flex w-full flex-1 flex-col items-start justify-center gap-12">
          <div>
            <h2 className="bold-40 lg:bold-40 mb-0 xl:max-w-[320px] text-black">Contact us for more information !</h2>
            <p className="regular-16 text-black p-0">Fill this form and send us a message</p>  
          </div>          
        </div>        
      </div>
    </section>
  )
}

export default Contact