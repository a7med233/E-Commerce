import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <div className='w-full md:w-1/2 max-w-[450px] mx-auto'>
          <img
            className='w-full h-auto object-cover rounded-lg shadow-md'
            src={assets.about_img}
            alt="About SwiftCart"
          />
        </div>
        <div className='flex flex-col justify-center gap-6 md:w-1/2 text-gray-600'>
          <p>At <span className='font-bold'>SwiftCart</span>, we are committed to transforming how you shop online. Our platform empowers users with the ability to analyze and compare product prices across multiple websites, ensuring that you always find the best deals effortlessly.</p>
          <p>By leveraging cutting-edge technology like web scraping, API integrations, and data visualization, we provide transparent and accurate insights tailored to your needs.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>We aim to foster consumer empowerment by simplifying online shopping and promoting fair competition among retailers. Our goal is to enhance your e-commerce experience through real-time pricing insights and intelligent tools, helping you make informed purchasing decisions.</p>
        </div>
      </div>


      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We deliver accurate and reliable price comparisons by integrating advanced technologies, ensuring that every piece of information on our platform is trustworthy and up-to-date.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Save time and effort by accessing prices across various e-commerce platforms in one place. Our intuitive design ensures seamless navigation and an enjoyable user experience.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>Your satisfaction is our priority. Our team is dedicated to providing prompt support and continuously improving the platform based on your feedback.</p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About