"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/components/button';
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/components/toaster"
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/components/input';
import Link from 'next/link';

export default function RegisterComponent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')

    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function registrationHandler() {
        setLoading(true)
        const url = `${process.env.NEXT_PUBLIC_ENDPOINT}/auth/signup`
        const data = {
            name,
            email,
            password,
            phone,
            place: city,
            role: "user"
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": "69420"
                },
                body: JSON.stringify(data)
            })
            const ans = await response.json()
            
            if(ans.detail === "User already exists") {
                toast({
                    title: "User Already Exists",
                    description: "Please try logging in instead"
                })
            } else if(ans.detail === "error") {
                toast({
                    title: "Invalid Credentials", 
                    description: "Please Re-Enter All The Information"
                })
            } else if(ans.detail === "User created successfully") {
                toast({
                    title: "Success!",
                    description: "Your account has been created successfully"
                })
                router.push('/login')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again."
            })
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='w-[60%] bg-white px-16 3xl:px-44 mt-2'>
            <form className='flex flex-col space-y-4 items-center justify-center bg-white p-4 h-full'>
                <h1 className='text-black sm:text-2xl font-semibold my-2'>Register Your Account</h1>
                <Input label="Name" id="name" name="name" type="text" placeholder="Enter Your Name" onChange={e => setName(e.target.value)} />
                <Input label="Email" id="email" name="email" type="text" placeholder="Enter Your Email" onChange={e => setEmail(e.target.value)} />
                <Input label="Password" id="password" name="password" type="password" placeholder="Input Your Password" onChange={e => setPassword(e.target.value)} />
                <Input label="Phone" id="phone" name="phone" type="text" placeholder="Enter Your Contact Number Here" onChange={e => setPhone(e.target.value)} />
                <Input label="City" id="city" name="city" type="text" placeholder="Enter Your City Here" onChange={e => setCity(e.target.value)} />
                <div className='w-full my-4'>
                    <Button center variant="danger" onClick={registrationHandler} 
                    disabled ={name == "" || phone == "" || city == "" || email == "" || password == ""} isLoading={loading}>Register</Button>      
                </div>
                {/* already have account */}
                <h1 className='text-black text-xs font-semibold my-8'>Already Have An Account? <Link href="/login" className='text-red-800 underline-offset-1'>Sign In</Link></h1>
            </form>
            <Toaster />
        </div>
  )
}
