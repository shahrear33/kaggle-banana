import { Kameron, Manrope } from 'next/font/google';
import Link from 'next/link';
import React from 'react'
const manrope = Manrope({ subsets: ["latin"], weight : '700'});

const kameron = Kameron({ subsets: ['latin'], weight: '700' })

export default function LoginPageLeftSide() {
  return (
    <div className='w-[60%]'>
        <div className="w-full h-[60%] bg-[url('/login.jpg')] bg-cover bg-bottom">
                
        </div>
        <div className="w-full h-[45%] bg-[url('/login_texture.png')] bg-[#227f7e]">
            <div className='px-16 py-8'>
                <div className='flex items-center'>
                    <Link href={'/'} className={`${kameron.className} text-6xl text-white font-black mx-4`} ><h1>Try Ship</h1></Link>
                </div>
                <h1 className={`text-2xl py-8 drop-shadow-sm text-white  ${manrope.className} mx-4`}>
                "Book your stay, your way - Effortless booking, unforgettable stays!"
                </h1>
            </div>
        </div>
    </div>
  )
}
