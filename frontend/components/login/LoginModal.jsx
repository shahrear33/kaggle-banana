"use client"
import { Button } from "@/components/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/components/dialog"
import { Input } from "@/components/ui/components/input"
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/components/toaster"
import { useToast } from '@/hooks/use-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { push_messaging_token } from '@/lib/push-message';

export function LoginModal() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    
    // Function to open modal
    const openModal = () => setIsOpen(true)
    
    // Function to close modal
    const closeModal = () => setIsOpen(false)

    async function loginHandler() {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_ENDPOINT}/login`
            const data = {
                username: email,
                password
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": "69420"
                },
                body: JSON.stringify(data)
            })
            
            const ans = await response.json()
            console.log('Login response:', ans)
            
            const id = ans?.user_id
            
            if (id != null) {
                // Store the token first
                localStorage.setItem('token', JSON.stringify(ans))
                
                // Close the modal first before any navigation
                closeModal()
                
                // Determine which dashboard to navigate to based on user role
                if (ans.user_role === "student") {
                    console.log("Redirecting to student dashboard")
                    setTimeout(() => {
                        router.push(`/dashboard/${id}`)
                    }, 500)
                } else if (ans.user_role === "company") {
                    console.log("Redirecting to company dashboard")
                    router.push(`/company/dashboard/${id}`)
                } else {
                    console.log("Redirecting to admin dashboard")
                    router.push(`/admin/dashboard/${id}`)
                }
                
                // Show success toast
                toast({
                    title: "Login Successful",
                    description: "Welcome back!"
                })
            } else if (ans.detail === "error") {
                toast({
                    title: "Invalid Credentials",
                    description: "Please Re-Enter Your Email and Password",
                    variant: "destructive"
                })
            } else {
                // Handle any other unexpected responses
                toast({
                    title: "Login Failed",
                    description: "There was an issue with your login. Please try again.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Login error:", error)
            toast({
                title: "Login Error",
                description: "There was a problem connecting to the server. Please try again later.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="text" className="text-text-primary font-bold">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 bg-white dark:bg-menu-bg border border-gray-200 dark:border-gray-800 shadow-xl">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Sign In</DialogTitle>
        </DialogHeader>
        <div className="p-8 pt-4 flex flex-col items-center bg-white dark:bg-menu-bg rounded-lg">
          <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Please sign in to continue</h2>

          <button className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-700 rounded-full bg-background transition-colors">
            <FcGoogle size={20} />
            <span className="text-text-primary">Continue with Google</span>
          </button>

          <div className="w-full flex items-center gap-2 my-4">
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <div className="w-full flex flex-col gap-4 my-4">
            <Input 
                type="email" 
                value={email}
                rounded
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="placeholder:text-sm"
            />

            <div className="relative">
              <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  size="lg"
                  rounded
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="mb-4 placeholder:text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[40%] -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <Button 
            center
            variant="primary" 
            onClick={loginHandler}
            disabled={loading}
            className="relative"
          >
            {loading ? (
              <>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span className="opacity-0">Sign In</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="my-4 text-sm text-gray-600 dark:text-gray-400">
            New to us?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
