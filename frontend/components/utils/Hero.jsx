"use client"
import { Kameron } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/components/button'
import { MdOutlineArchitecture, MdOutlineDesignServices } from 'react-icons/md'
import { FiHome, FiUser } from 'react-icons/fi'
import { BsBuilding } from 'react-icons/bs'

const kameron = Kameron({ subsets: ['latin'], weight: '700' })

export default function Hero({ landing = true }) {
  const pathname = usePathname()
  const [signedIn, setSignedIn] = useState(false)
  const [token, setToken] = useState(false)
  const [nav, setNav] = useState(false)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); 
  const notificationRef = useRef(null);

  useEffect(() => {
    let token = localStorage.getItem("token")
    if(token) {
      setSignedIn(true)
    }
    if(!token) {
      return
    }
    try {
      // Parse the token if it's in JSON format
      token = JSON.parse(token)
    } catch (error) {
      // If token is not JSON, keep it as is
      console.log('Token is not in JSON format')
    }
    
    setToken(token)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNav = () => {
      setNav(!nav)
  }
  function signOutHandler() {
    localStorage.removeItem('token');
    router.push('/')
    setSignedIn(false)
  }

  function TokenCheckHandler(url) {
    let token = localStorage.getItem("token")
    router.push(url)
  }

  function navigateToDashboard() {
    let storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push('/')
      return
    }
    
    try {
      // Try to parse the token as JSON
      const tokenData = JSON.parse(storedToken)
      const userRole = tokenData.user_role
      const userId = tokenData.user_id
      
      if (userRole === 'student') {
        router.push(`/dashboard/${userId}`)
      } else if (userRole === 'company') {
        router.push(`/company/dashboard/${userId}`)
      } else if (userRole === 'admin') {
        router.push(`/admin/dashboard/${userId}`)
      } else {
        // Default fallback
        router.push('/')
      }
    } catch (error) {
      console.error('Error parsing token or navigating to dashboard:', error)
      router.push('/')
    }
  }
  return (
    <>
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo - Left */}
          <div className="flex items-center space-x-2">
            <MdOutlineArchitecture className="text-3xl text-gray-800" />
            <Link href={'/'} className={`${kameron.className} text-2xl font-light tracking-tight text-gray-800`}>
              <h1>3D VISION <span className="font-bold">AI</span></h1>
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="hidden md:flex items-center space-x-6 text-gray-600">
            <Link href="/" className="hover:text-black flex items-center space-x-1">
              <FiHome /> <span>Home</span>
            </Link>
            <Link href="/architecture" className="hover:text-black flex items-center space-x-1">
              <BsBuilding /> <span>3D Architecture</span>
            </Link>
            <Link href="/interior" className="hover:text-black flex items-center space-x-1">
              <MdOutlineDesignServices /> <span>Interior Design</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleNav}
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>

          {/* Auth Controls - Right */}
          <div className="hidden md:flex items-center space-x-4">
            {!signedIn ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-100">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-black hover:bg-gray-800 text-grey-900">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className='flex items-center space-x-5'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='focus:outline-none outline-none border-none'>
                    <div className='flex items-center space-x-2 p-2 transition-colors duration-200'>
                      <FiUser className="w-6 h-6 text-gray-600" />
                      <AiOutlineMenu className='text-xl text-gray-600' />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='bg-white mr-8 mt-2 p-2 rounded-xl shadow-lg border border-gray-200 min-w-[200px] z-50'>
                    
                    <div className='py-2'>
                      <DropdownMenuItem className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200'>
                        <div onClick={navigateToDashboard} className='flex items-center space-x-2 text-gray-700 cursor-pointer'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Dashboard</span>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200'>
                        <Link href="/profile" className='flex items-center space-x-2 text-gray-700'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200'>
                        <Link href="/settings" className='flex items-center space-x-2 text-gray-700'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <div className='border-t border-gray-200 mt-2 pt-2'>
                      <DropdownMenuItem className='px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200'>
                        <Button
                          variant="outline"
                          onClick={signOutHandler} 
                          className='flex items-center space-x-2 text-red-600 w-full'
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </Button>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {nav && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/" className="text-gray-600 hover:text-black flex items-center space-x-2">
                <FiHome /> <span>Home</span>
              </Link>
              <Link href="/architecture" className="text-gray-600 hover:text-black flex items-center space-x-2">
                <BsBuilding /> <span>3D Architecture</span>
              </Link>
              <Link href="/interior" className="text-gray-600 hover:text-black flex items-center space-x-2">
                <MdOutlineDesignServices /> <span>Interior Design</span>
              </Link>
              {!signedIn ? (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-black hover:bg-gray-800 text-grey-900">Sign Up</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline" onClick={navigateToDashboard} className="w-full">Dashboard</Button>
                  <Button variant="outline" onClick={signOutHandler} className="w-full text-red-600">Sign Out</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}