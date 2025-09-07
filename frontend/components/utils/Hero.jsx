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
import { Input } from '../ui/components/input'
import { Toaster } from '../ui/components/toaster'
import { useToast } from '../../hooks/use-toast'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

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

  async function loginHandler() {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_ENDPOINT}/login`;
    const data = {
      username: email,
      password,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      body: JSON.stringify(data),
    });
    const ans = await response.json();
    const id = ans?.user_id;
    console.log(ans);
    if (id != null) {
      console.log("user_id", id);
      localStorage.setItem("token", JSON.stringify(ans));
      setSignedIn(true);
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
      router.push("/");
    }
    if (ans.detail == "error") {
      toast({
        title: "Invalid Credentials",
        description: `Please Re-Enter Your Email and Password`,
      });
    }
    setLoading(false);
  }
  return (
    <>
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
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
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-100"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </Button>
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
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 hover:bg-gray-100"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login
                  </Button>
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 min-h-[500px] flex items-center justify-center">
            <div className="p-8 w-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Login to Your Account</h2>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              {/* Social Login Buttons */}
              <div className="mb-8 space-y-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <Input
                    type="email"
                    value={email}
                    rounded
                    size="lg"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="placeholder:text-sm"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    size="lg"
                    rounded
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="placeholder:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[40%] -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox border border-gray-300"
                  />
                  <label htmlFor="remember" className="text-gray-500 text-sm">
                    Remember Me
                  </label>
                </div>
                <a href="#" className="text-indigo-600 text-sm hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <div className="mt-8">
                <Button
                  onClick={loginHandler}
                  variant="outline-secondary"
                  center
                  disabled={email === "" || password === ""}
                  isLoading={loading}
                  className="w-full"
                >
                  Login
                </Button>
              </div>

              {/* Sign Up Link */}
              <p className="mt-8 text-sm text-gray-600 text-center">
                New to us?{" "}
                <Link
                  href="/signup"
                  className="text-indigo-600 hover:underline font-medium"
                  onClick={() => setShowLoginModal(false)}
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </>
  )
}