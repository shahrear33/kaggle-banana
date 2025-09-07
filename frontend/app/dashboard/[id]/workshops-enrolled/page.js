"use client"
import { useState } from 'react'
import { Quicksand, Poppins, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/components/card'
import { Badge } from '@/components/ui/components/badge'
import { Button } from '@/components/ui/components/button'
import { Progress } from '@/components/ui/components/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/components/tabs'
import { FaLaptopCode, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

export default function WorkshopsEnrolledPage() {
  const { toast } = useToast()
  
  return (
    <div className={`${playfair.className} p-6`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}>
            Your Workshops & Hackathons
          </h1>
          <Button size="sm" variant="outline" className="gap-2">
            <FaLaptopCode className="text-primary" />
            Browse Events
          </Button>
        </div>
        
        <Tabs defaultValue="workshops" className="mb-6">
          <TabsList className="grid w-full md:w-80 grid-cols-2">
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workshops" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white dark:bg-dark-2 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg font-medium">Workshop Placeholder</CardTitle>
                    <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      Enrolled
                    </Badge>
                  </div>
                  <CardDescription>Advanced React Patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt />
                        <span>May 15, 2025</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt />
                        <span>Virtual</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaUsers />
                        <span>42 Participants</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is where your enrolled workshops will appear. Learn practical skills through hands-on sessions with industry experts.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Preparation Progress</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button size="sm" variant="outline">Workshop Details</Button>
                  <Button size="sm" variant="primary">Pre-workshop Materials</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="hackathons" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white dark:bg-dark-2 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg font-medium">Hackathon Placeholder</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                      Upcoming
                    </Badge>
                  </div>
                  <CardDescription>AI for Education Hackathon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt />
                        <span>May 20-22, 2025</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt />
                        <span>Virtual</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaUsers />
                        <span>120 Participants</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is where your registered hackathons will appear. Collaborate with peers, solve real-world problems, and compete for prizes.
                    </p>
                    
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">AI</Badge>
                      <Badge variant="outline">Education</Badge>
                      <Badge variant="outline">Machine Learning</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button size="sm" variant="outline">Team Management</Button>
                  <Button size="sm" variant="primary">Hackathon Details</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
