"use client"
import { useState } from 'react'
import { Quicksand, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { Toaster } from '@/components/ui/components/toaster'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs'
import { Button } from '@/components/ui/components/button'
import { Badge } from '@/components/ui/components/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select'
import { FaTrophy, FaMedal, FaChevronDown, FaFilter, FaStar, FaCode, FaLaptopCode, FaDatabase, FaBrain, FaMobileAlt, FaChartLine } from 'react-icons/fa'
import { useLanguage } from '@/lib/language/LanguageContext'
import { useToast } from '@/hooks/use-toast'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

// Mock data for multiple microtasks
const mockTasks = [
  {
    id: 1,
    title: "Full Stack Web Application",
    description: "Build a responsive web application with React and Node.js",
    category: "Web Development",
    icon: <FaLaptopCode className="text-blue-500" />,
    difficulty: "Advanced",
    enrolledDate: "April 10, 2025",
    deadline: "May 15, 2025",
    progress: 85,
    leaderboard: [
      { rank: 1, name: 'Alex Johnson', score: 950, avatar: '/profile.png' },
      { rank: 2, name: 'Maria Garcia', score: 920, avatar: '/profile.png' },
      { rank: 3, name: 'John Smith', score: 885, avatar: '/profile.png' },
      { rank: 4, name: 'You', score: 760, avatar: '/profile.png', isCurrentUser: true },
      { rank: 5, name: 'Emma Wilson', score: 742, avatar: '/profile.png' },
      { rank: 6, name: 'Michael Brown', score: 698, avatar: '/profile.png' },
    ]
  },
  {
    id: 2,
    title: "ML Classification Algorithm",
    description: "Implement and optimize a machine learning classification algorithm",
    category: "Machine Learning",
    icon: <FaBrain className="text-purple-500" />,
    difficulty: "Intermediate",
    enrolledDate: "March 22, 2025",
    deadline: "May 5, 2025",
    progress: 65,
    leaderboard: [
      { rank: 1, name: 'Sarah Chen', score: 875, avatar: '/profile.png' },
      { rank: 2, name: 'You', score: 840, avatar: '/profile.png', isCurrentUser: true },
      { rank: 3, name: 'David Park', score: 820, avatar: '/profile.png' },
      { rank: 4, name: 'Lisa Johnson', score: 795, avatar: '/profile.png' },
      { rank: 5, name: 'Robert Davis', score: 780, avatar: '/profile.png' },
    ]
  },
  {
    id: 3,
    title: "Mobile App UI/UX Design",
    description: "Design a mobile app interface focusing on user experience",
    category: "UI/UX Design",
    icon: <FaMobileAlt className="text-green-500" />,
    difficulty: "Beginner",
    enrolledDate: "April 15, 2025",
    deadline: "May 20, 2025",
    progress: 92,
    leaderboard: [
      { rank: 1, name: 'Miguel Santos', score: 930, avatar: '/profile.png' },
      { rank: 2, name: 'Emma Wilson', score: 905, avatar: '/profile.png' },
      { rank: 3, name: 'You', score: 890, avatar: '/profile.png', isCurrentUser: true },
      { rank: 4, name: 'Olivia Martin', score: 845, avatar: '/profile.png' },
      { rank: 5, name: 'William Lee', score: 820, avatar: '/profile.png' },
      { rank: 6, name: 'Sofia Rodriguez', score: 790, avatar: '/profile.png' },
    ]
  },
  {
    id: 4,
    title: "Database Optimization Challenge",
    description: "Optimize database queries for improved performance",
    category: "Database",
    icon: <FaDatabase className="text-red-500" />,
    difficulty: "Advanced",
    enrolledDate: "April 2, 2025",
    deadline: "May 10, 2025",
    progress: 75,
    leaderboard: [
      { rank: 1, name: 'David Thompson', score: 985, avatar: '/profile.png' },
      { rank: 2, name: 'Ethan Williams', score: 950, avatar: '/profile.png' },
      { rank: 3, name: 'Sophia Chen', score: 925, avatar: '/profile.png' },
      { rank: 4, name: 'Liam Rodriguez', score: 890, avatar: '/profile.png' },
      { rank: 5, name: 'You', score: 865, avatar: '/profile.png', isCurrentUser: true },
      { rank: 6, name: 'Ava Johnson', score: 840, avatar: '/profile.png' },
      { rank: 7, name: 'Noah Martinez', score: 810, avatar: '/profile.png' },
    ]
  },
  {
    id: 5,
    title: "Data Visualization Project",
    description: "Create interactive data visualizations using D3.js",
    category: "Data Science",
    icon: <FaChartLine className="text-amber-500" />,
    difficulty: "Intermediate",
    enrolledDate: "March 30, 2025",
    deadline: "May 8, 2025",
    progress: 50,
    leaderboard: [
      { rank: 1, name: 'Oliver Wilson', score: 910, avatar: '/profile.png' },
      { rank: 2, name: 'Charlotte Brown', score: 895, avatar: '/profile.png' },
      { rank: 3, name: 'Henry Davis', score: 880, avatar: '/profile.png' },
      { rank: 4, name: 'Mia Martinez', score: 865, avatar: '/profile.png' },
      { rank: 5, name: 'Sebastian Lee', score: 850, avatar: '/profile.png' },
      { rank: 6, name: 'You', score: 830, avatar: '/profile.png', isCurrentUser: true },
      { rank: 7, name: 'Amelia Scott', score: 815, avatar: '/profile.png' },
    ]
  },
]

// Component for displaying a single leaderboard
function LeaderboardCard({ task }) {
  const userRank = task.leaderboard.find(user => user.isCurrentUser)?.rank || '–';
  
  return (
    <Card className="bg-white dark:bg-dark-2 shadow-sm mb-8 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {task.icon}
              <Badge variant="outline" className="font-normal">{task.category}</Badge>
              <Badge variant="secondary" className="font-normal">{task.difficulty}</Badge>
            </div>
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {task.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end gap-2">
              <span>Your Rank:</span>
              <span className="font-medium text-primary">#{userRank}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Deadline: {task.deadline}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Top 3 podium - only show if we have at least 3 users */}
        {task.leaderboard.length >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-end mb-10 mt-4 gap-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16 border-2 border-gray-300">
                <AvatarImage src={task.leaderboard[1].avatar} alt={task.leaderboard[1].name} />
                <AvatarFallback>{task.leaderboard[1].name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="h-24 w-20 bg-gray-300 mt-2 rounded-t-lg flex items-center justify-center">
                <FaMedal className="text-white text-xl" />
              </div>
              <p className="mt-2 font-medium">{task.leaderboard[1].name}</p>
              <p className="text-sm">{task.leaderboard[1].score} pts</p>
            </div>
            
            {/* 1st Place */}
            <div className="flex flex-col items-center scale-110">
              <Avatar className="w-20 h-20 border-2 border-yellow-500">
                <AvatarImage src={task.leaderboard[0].avatar} alt={task.leaderboard[0].name} />
                <AvatarFallback>{task.leaderboard[0].name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="h-32 w-24 bg-gradient-to-t from-amber-500 to-yellow-300 mt-2 rounded-t-lg flex items-center justify-center">
                <FaTrophy className="text-white text-2xl" />
              </div>
              <p className="mt-2 font-medium">{task.leaderboard[0].name}</p>
              <p className="text-sm">{task.leaderboard[0].score} pts</p>
            </div>
            
            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <Avatar className="w-14 h-14 border-2 border-amber-700">
                <AvatarImage src={task.leaderboard[2].avatar} alt={task.leaderboard[2].name} />
                <AvatarFallback>{task.leaderboard[2].name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="h-20 w-16 bg-amber-700 mt-2 rounded-t-lg flex items-center justify-center">
                <FaMedal className="text-white text-lg" />
              </div>
              <p className="mt-2 font-medium">{task.leaderboard[2].name}</p>
              <p className="text-sm">{task.leaderboard[2].score} pts</p>
            </div>
          </motion.div>
        )}
        
        {/* Rest of leaderboard */}
        <div className="space-y-3 mt-8">
          {task.leaderboard.map((user, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`flex items-center p-3 rounded-lg ${
                user.isCurrentUser 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-gray-50 dark:bg-gray-800/30'
              }`}
            >
              <div className="w-10 font-bold text-gray-500 dark:text-gray-400 text-center">
                #{user.rank}
              </div>
              <Avatar className="mr-3 h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className={`font-medium ${user.isCurrentUser ? 'text-primary' : ''}`}>
                  {user.name}
                </p>
              </div>
              <div className="font-medium text-sm flex items-center">
                <span className="w-6 h-6 bg-amber-400/20 rounded-full mr-2 flex items-center justify-center">
                  <FaStar className="text-amber-500 text-xs" />
                </span>
                {user.score} pts
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default function LeaderboardPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // Filter tasks based on selected category and difficulty
  const filteredTasks = mockTasks.filter(task => {
    const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });
  
  // Get unique categories from tasks
  const categories = ['all', ...new Set(mockTasks.map(task => task.category))];
  // Get unique difficulties from tasks
  const difficulties = ['all', ...new Set(mockTasks.map(task => task.difficulty))];
  
  return (
    <div className={`${playfair.className} p-6`}>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white mb-1`}>
              Your Leaderboards
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your progress across all your enrolled microtasks
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Display filtered leaderboards */}
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <LeaderboardCard key={task.id} task={task} />
          ))
        ) : (
          <Card className="bg-white dark:bg-dark-2 shadow-sm p-8 text-center">
            <CardContent>
              <div className="py-12">
                <FaTrophy className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Matching Leaderboards</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  There are no leaderboards matching your current filters. Try adjusting your filter criteria or enroll in more microtasks.
                </p>
                <Button variant="outline" onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
