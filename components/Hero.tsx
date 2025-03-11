import Image from 'next/image'
import Button from './Button'

const Hero = () => {  
  return (
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-2 md:gap-28 lg:py-15 xl:flex-row">
      {/* <div className="hero-map"/> */}
      <div className="relative z-20 flex flex-1 flex-col items-center xl:w-1/2">
        <Image 
          src="/apim.png"
          alt="camp"
          width={300}  
          height={300}
          className="absolute left-[-5px] top-[-30px] w-50 lg:w-[300px]"
        />
        <h1 className="bold-52 lg:bold-60 z-10 text-center mb-2">⚡ Your Auto-Generated APIs, Ready to Use! 🚀</h1>
        <span className="px-3 py-2 mt-4 mb-0 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md">
          ✅ APIs Already Created & Automatic api with you logic
        </span>
        <p className="z-10 regular-16 mt-6 dark:text-white text-gray-50 xl:max-w-[520px] text-center mx-4">
        AutoJX is a powerful and intuitive tool that simplifies creating and managing structured data. Perfect for testing, prototyping, and demos, saving time and enhancing workflow efficiency.
        </p>

        <div className=" z-10 flex flex-col w-full gap-3 justify-center sm:flex-row my-5">
          <Button 
            href="/dashboard" 
            title="Let's get started" 
            variant="mt-2 px-4 py-[10px] text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full  font-semibold hover:from-orange-600 hover:to-pink-600 transition duration-300"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero