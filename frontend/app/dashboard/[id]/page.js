"use client"
import { useState } from 'react'
import { Quicksand, Poppins, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/components/card'
import { Progress } from '@/components/ui/components/progress'
import { Button } from '@/components/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar'
import { Badge } from '@/components/ui/components/badge'
import { FaTasks, FaTrophy, FaCertificate, FaVideo, FaLaptopCode, FaGraduationCap, FaRegCalendarAlt, FaRegClock, FaChartLine } from 'react-icons/fa'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

export default function Dashboard() {
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  
  // Mock data for dashboard stats
  const stats = [
    { title: 'Tasks Completed', value: 12, icon: <FaTasks className="text-blue-500" />, change: '+3 this week' },
    { title: 'Leaderboard Rank', value: '#4', icon: <FaTrophy className="text-amber-500" />, change: 'Up 2 places' },
    { title: 'Certificates', value: 3, icon: <FaCertificate className="text-green-500" />, change: '+1 this month' },
    { title: 'Mentor Sessions', value: 8, icon: <FaVideo className="text-purple-500" />, change: 'Next: Tomorrow' },
  ]
  
  // Career progress
  const careerProgress = [
    { skill: 'React Development', progress: 75 },
    { skill: 'UI/UX Design', progress: 60 },
    { skill: 'Backend Development', progress: 45 },
    { skill: 'Data Analysis', progress: 30 },
  ]
  
  // Upcoming events
  const upcomingEvents = [
    { 
      title: 'Frontend Development Workshop', 
      type: 'Workshop',
      date: 'May 12, 2025', 
      time: '10:00 AM - 12:00 PM',
      icon: <FaLaptopCode />
    },
    { 
      title: 'Career Planning Session', 
      type: 'Mentoring',
      date: 'May 14, 2025', 
      time: '2:00 PM - 3:00 PM',
      icon: <FaGraduationCap />
    },
    { 
      title: 'AI for Education Hackathon', 
      type: 'Hackathon',
      date: 'May 20-22, 2025', 
      time: 'All day',
      icon: <FaLaptopCode />
    },
  ]
  
  return (
    <div className={`${playfair.className} dark:bg-menu-bg p-6`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white mb-2`}>
            Welcome back, Student!
          </h1>
          <p className="text-gray-600 dark:text-white">
            Your personalized career development journey awaits. Here's what's happening with your progress.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white dark:bg-dark-2 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Career Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Roadmap Progress */}
            <Card className="bg-white dark:bg-dark-2 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaChartLine className="text-primary" />
                    <span>AI Career Roadmap Progress</span>
                  </h2>
                  <Link href={`/dashboard/${params.id}/running-tasks`}>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                      View Details
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-5">
                  {careerProgress.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{skill.skill}</span>
                        <span className="text-gray-500 dark:text-gray-400">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">On track to complete roadmap</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">52%</span>
                    <Badge className="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      +5% from last month
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Current Tasks */}
            <Card className="bg-white dark:bg-dark-2 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaTasks className="text-primary" />
                    <span>Current Micro Tasks</span>
                  </h2>
                  <Link href={`/dashboard/${params.id}/running-tasks`}>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Build a Responsive Dashboard</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a responsive dashboard using React and Tailwind CSS</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        In Progress
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-1.5" />
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                      <span>Due: May 10, 2025</span>
                      <Link href={`/dashboard/${params.id}/running-tasks`}>
                        <Button size="sm" variant="outline">Continue Task</Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">API Integration Challenge</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Implement a REST API integration with authentication</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                        Just Started
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="h-1.5" />
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                      <span>Due: May 15, 2025</span>
                      <Link href={`/dashboard/${params.id}/running-tasks`}>
                        <Button size="sm" variant="outline">Continue Task</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Events & Recommendations */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-white dark:bg-dark-2 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaRegCalendarAlt className="text-primary" />
                    <span>Upcoming Events</span>
                  </h2>
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                    View Calendar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border-b last:border-0 border-gray-100 dark:border-gray-800">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-primary">
                        {event.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Badge variant="outline" className="px-1.5 py-0 text-xs">{event.type}</Badge>
                          <div className="flex items-center gap-1">
                            <FaRegCalendarAlt className="text-gray-400" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaRegClock className="text-gray-400" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link href={`/dashboard/${params.id}/virtual-sessions`}>
                    <Button variant="outline" className="w-full" size="sm">Manage Events</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommended Companies */}
            <Card className="bg-white dark:bg-dark-2 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recommended Companies</h2>
                  <Link href="/companies">
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/profile.png" alt="Company" />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">TechCorp Inc.</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Web Development, AI Solutions</p>
                    </div>
                    <Badge variant="outline" className="text-xs">92% Match</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/profile.png" alt="Company" />
                      <AvatarFallback>IS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">Innovate Solutions</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">UX Design, Frontend Engineering</p>
                    </div>
                    <Badge variant="outline" className="text-xs">85% Match</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/profile.png" alt="Company" />
                      <AvatarFallback>DL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">DataLeap</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Data Science, Analytics</p>
                    </div>
                    <Badge variant="outline" className="text-xs">78% Match</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
