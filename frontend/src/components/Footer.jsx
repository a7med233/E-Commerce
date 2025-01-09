import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="SwiftCart Logo" />
                <p className='w-full md:w-2/3 text-gray-600'>
                At SwiftCart, we are dedicated to making your online shopping smarter and simpler. Discover the best deals, compare prices, and shop with confidence.
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li><Link to="/" className="hover:text-gray-800 transition-colors">Home</Link></li>
                    <li><Link to="/about" className="hover:text-gray-800 transition-colors">About us</Link></li>
                    <li><Link to="/delivery" className="hover:text-gray-800 transition-colors">Delivery</Link></li>
                    <li><Link to="/privacy-policy" className="hover:text-gray-800 transition-colors">Privacy Policy</Link></li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+36-00-123-4567</li>
                    <li>contactus@swiftcart.com</li>
                </ul>
            </div>
        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ swiftcart.com - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer