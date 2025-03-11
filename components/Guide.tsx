import Image from 'next/image'
import React from 'react'
import Button from './Button'

const Guide = () => {
  return (
    <section className="flexCenter flex-col">
      {/* <div className=" text-center padding-container max-container w-full pb-8">
        <p className="uppercase regular-18 -mt-1 mb-3 text-gray-50">
          Because you have to go fast 🚀
        </p>
        <div>
          <h2 className="mb-2 bold-40 lg:bold-64 xl:max-w-[390px]">Guide You to Easy Path</h2>
          <p className="regular-16 text-gray-30 xl:max-w-[520px]">Only with the AjsonX application you will no longer get lost and get lost again.</p>
          <div className=" z-10 flex flex-col w-full gap-3 justify-center sm:flex-row my-8">
            <Button 
              href="/api-guide" 
              title="Go to the guide" 
              variant="px-4 py-3 border-black text-black dark:border-white dark:text-white  border-1 rounded-full  font-semibold hover:from-orange-600 hover:to-pink-600 transition duration-300"
            />
          </div>
        </div>
      </div> */}
      
      <div className="mb-8 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-8">
          <div>
            <h3 className="font-semibold mb-2">What's your typical response time?</h3>
            <p className="text-muted-foreground">
              We aim to respond to all inquiries within 24 hours during business days.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer technical support?</h3>
            <p className="text-muted-foreground">
              Yes, our team provides technical support for all paid plans. Free plan users can access community support.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I request a custom feature?</h3>
            <p className="text-muted-foreground">
              We welcome feature requests and consider them for our roadmap based on demand and feasibility.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How do I report a bug?</h3>
            <p className="text-muted-foreground">
              You can report bugs through this contact form or directly on our GitHub repository's issue tracker.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Guide