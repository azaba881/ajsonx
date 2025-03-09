import { FEATURES } from '@/constants'
import Image from 'next/image'
import React from 'react'

const Features = () => {
  return (
    <section className="flex-col flexCenter overflow-hidden bg-feature-bg bg-center bg-no-repeat py-24 pt-4">
      <div className="max-container padding-container relative w-full flex justify-end">
        <div className="z-20 flex w-full flex-col justify-center lg:w-full">
          <div className='relative'>
            <p className="z-10 regular-16 mt-6 text-gray-50 xl:max-w-[520px] text-center mx-4">
              Here are the API solutions we offer : Select the kind of api you want to build and use and have a fun.
            </p>          
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:mg-20 lg:gap-20 cursor-pointer">
            {FEATURES.map((feature) => (
              <FeatureItem    
                key={feature.title}   
                title={feature.title} 
                description={feature.description}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

type FeatureItem = {
  title: string;
  description: string;
}

const FeatureItem = ({ title, description }: FeatureItem) => {
  return (
    <li className="flex w-full flex-1 flex-col items-start py-4 px-2 rounded-[20px] border-[1.5px] border-image">
      <h2 className="bold-20 lg:bold-32 mt-5 capitalize text-gray-50">
        {title}
      </h2>
      <p className="regular-16 mt-5 text-gray-50 lg:mt-[30px] lg:bg-none">
        {description}
      </p>
    </li>
  )
}

export default Features