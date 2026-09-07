import React from 'react'
import { FaInstagram } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa"
export default function
() {
  return (
    <div className='w-screen flex flex-col justify-center items-center bg-black py-6 gap-y-6'>
        <div className='w-full sm:w-[70%] grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 px-6 sm:px-0 justify-items-center sm:justify-items-start'>
            <div className='flex flex-col w-full sm:w-[300px] gap-y-3 col-span-2 sm:col-span-1 items-center sm:items-start text-center sm:text-left'>
                <span className='text-2xl font-bold text-white'>SDICKERS</span>
                <span className='text-xs text-[#8a8a8a]'>Premium Sticker drops for collectors who appreciates the Art of Adhesion. Stick Everywhere, Conform Nowhere.</span>
            </div>
            <div className='flex flex-col gap-y-3 items-center sm:items-start'>
                <span className='text-white font-semibold text-xs'>SHOP</span>
                <span className='flex flex-col text-[#8a8a8a] text-xs gap-y-3'>
                    <span>New Drops</span>
                    <span>Collections</span>
                    <span>Best Sellers</span>
                    <span>Gift Cards</span>
                </span>
            </div>
            <div className='flex flex-col gap-y-3 items-center sm:items-start'>
                <span className='text-white font-semibold text-xs'>COMPANY</span>
                <span className='flex flex-col text-[#8a8a8a] text-xs gap-y-3'>
                    <span>About Us</span>
                    <span>Careers</span>
                    <span>Press Kit</span>
                    <span>Contact</span>
                </span>
            </div>
            <div className='flex flex-col gap-y-3 items-center sm:items-start'>
                <span className='text-white font-semibold text-xs'>HELP</span>
                <span className='flex flex-col text-[#8a8a8a] text-xs gap-y-3'>
                    <span>Shipping & Returns</span>
                    <span>FAQ</span>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </span>
            </div>
        </div>
        <hr className='h-[2px] bg-[#8a8a8a] w-full sm:w-[70%]'/>
        <div className='w-full sm:w-[70%] flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-y-4 text-xs px-6 sm:px-0'>
            <span className='text-[#8a8a8a]'>Kathmandu, Nepal</span>
            <div className='flex gap-x-4'>
                <div className='h-[30px] w-[30px] border-1 border-[#8a8a8a] rounded-full flex justify-center items-center text-white text-[15px]'>
                    <FaInstagram/>
                </div>
                <div className='h-[30px] w-[30px] border-1 border-[#8a8a8a] rounded-full flex justify-center items-center text-white text-[15px]'>
                    <FaTiktok/>
                </div>
            </div>
            <span className='text-[#8a8a8a]'>© 2026 SDICKERS, Stick Culture</span>
        </div>
    </div>
  )
}
