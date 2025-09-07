"use client"
import { useState, useEffect } from 'react'
import { Quicksand, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/components/toaster'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/components/card'
import { Badge } from '@/components/ui/components/badge'
import { Progress } from '@/components/ui/components/progress'
import { Button } from '@/components/ui/components/button'
import { Input } from '@/components/ui/components/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select'
import { FaLaptopCode, FaCalendarAlt, FaStar, FaFilter, FaCog, FaBrain, FaCode, FaDatabase, FaChartLine, FaMobileAlt, FaRegClock, FaCheck, FaExclamationTriangle, FaSearch, FaSort, FaChevronRight } from 'react-icons/fa'
import { useLanguage } from '@/lib/language/LanguageContext'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    title: "Build a React Component Library",
    category: "Web Development",
    description: "Create a reusable React component library with at least 10 components. Must include form elements, navigation and modals.",
    deadline: "May 15, 2025",
    createdAt: "April 2, 2025",
    status: "in-progress",
    priority: "high",
    progress: 68,
    skills: ["React", "JavaScript", "UI Design", "Component Architecture"],
    subtasks: [
      { name: "Set up project structure", completed: true },
      { name: "Create button components", completed: true },
      { name: "Create form components", completed: true },
      { name: "Create navigation components", completed: false },
      { name: "Create modal components", completed: false },
      { name: "Implement dark mode", completed: false },
      { name: "Write documentation", completed: false },
    ],
    company: {
      name: "TechSolutions Inc.",
      logo: "/companies/tech-solutions.svg",
      industry: "Software Development"
    },
    difficulty: "Intermediate",
    icon: <FaCode className="text-blue-500" />,
    timeEstimate: "20 hours",
    points: 500
  },
  {
    id: 2,
    title: "Database Optimization Challenge",
    category: "Database",
    description: "Optimize a set of given SQL queries to improve performance by at least 40%. You'll work with a real-world dataset and explain your optimization strategies.",
    deadline: "May 12, 2025",
    createdAt: "April 5, 2025",
    status: "in-progress",
    priority: "medium",
    progress: 45,
    skills: ["SQL", "Database Design", "Query Optimization", "Indexing"],
    subtasks: [
      { name: "Analyze current query performance", completed: true },
      { name: "Identify bottlenecks", completed: true },
      { name: "Create indexes", completed: false },
      { name: "Rewrite inefficient queries", completed: false },
      { name: "Benchmark optimized queries", completed: false },
      { name: "Document optimization strategies", completed: false },
    ],
    company: {
      name: "DataMasters LLC",
      logo: "/companies/datamasters.svg",
      industry: "Data Analytics"
    },
    difficulty: "Advanced",
    icon: <FaDatabase className="text-red-500" />,
    timeEstimate: "15 hours",
    points: 600
  },
  {
    id: 3,
    title: "ML Classification Algorithm",
    category: "Machine Learning",
    description: "Implement and optimize a machine learning classification algorithm for sentiment analysis with at least 85% accuracy.",
    deadline: "May 20, 2025",
    createdAt: "April 10, 2025",
    status: "in-progress",
    priority: "high",
    progress: 25,
    skills: ["Python", "Machine Learning", "Data Processing", "NLP"],
    subtasks: [
      { name: "Prepare dataset", completed: true },
      { name: "Feature engineering", completed: false },
      { name: "Model selection", completed: false },
      { name: "Training and validation", completed: false },
      { name: "Hyperparameter tuning", completed: false },
      { name: "Performance evaluation", completed: false },
    ],
    company: {
      name: "AI Solutions Ltd",
      logo: "/companies/ai-solutions.svg",
      industry: "Artificial Intelligence"
    },
    difficulty: "Advanced",
    icon: <FaBrain className="text-purple-500" />,
    timeEstimate: "25 hours",
    points: 750
  },
  {
    id: 4,
    title: "Mobile App UI/UX Design",
    category: "UI/UX Design",
    description: "Design a mobile app interface focusing on user experience for a financial management application. Must include wireframes and interactive prototypes.",
    deadline: "May 25, 2025",
    createdAt: "April 15, 2025",
    status: "in-progress",
    priority: "medium",
    progress: 80,
    skills: ["UI Design", "User Experience", "Figma", "Prototyping"],
    subtasks: [
      { name: "User research", completed: true },
      { name: "Create user personas", completed: true },
      { name: "Wireframing", completed: true },
      { name: "High-fidelity designs", completed: true },
      { name: "Interactive prototype", completed: false },
      { name: "User testing", completed: false },
    ],
    company: {
      name: "DesignWorks Co.",
      logo: "/companies/designworks.svg",
      industry: "Design"
    },
    difficulty: "Intermediate",
    icon: <FaMobileAlt className="text-green-500" />,
    timeEstimate: "18 hours",
    points: 450
  },
  {
    id: 5,
    title: "Data Visualization Dashboard",
    category: "Data Science",
    description: "Create an interactive data visualization dashboard using D3.js or similar library to present insights from a complex dataset.",
    deadline: "June 1, 2025",
    createdAt: "April 20, 2025",
    status: "in-progress",
    priority: "low",
    progress: 10,
    skills: ["JavaScript", "D3.js", "Data Visualization", "Statistical Analysis"],
    subtasks: [
      { name: "Analyze dataset", completed: true },
      { name: "Define visualizations needed", completed: false },
      { name: "Set up project structure", completed: false },
      { name: "Create basic charts", completed: false },
      { name: "Implement interactivity", completed: false },
      { name: "Optimize performance", completed: false },
    ],
    company: {
      name: "DataInsight Corp",
      logo: "/companies/datainsight.svg",
      industry: "Business Intelligence"
    },
    difficulty: "Intermediate",
    icon: <FaChartLine className="text-amber-500" />,
    timeEstimate: "22 hours",
    points: 550
  }
];

// Task Card Component for displaying individual tasks
function TaskCard({ task }) {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'low': return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-dark-2 shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-800">
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {task.icon}
              <Badge variant="outline" className="font-normal">{task.category}</Badge>
              <Badge variant="secondary" className="font-normal">{task.difficulty}</Badge>
            </div>
            <CardTitle className="text-lg font-medium">
              {task.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {task.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`${getPriorityColor(task.priority)} capitalize`}>
            {task.priority} Priority
          </Badge>
        </CardHeader>
        
        <CardContent className="pb-2">
          {/* Skills section */}
          <div className="flex flex-wrap gap-1 mb-3">
            {task.skills.map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* Progress section */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Progress ({completedSubtasks}/{totalSubtasks} subtasks)
              </span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className={`h-2 ${getProgressColor(task.progress)}`} />
          </div>
          
          {/* Company info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs">
                {task.company.name.charAt(0)}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{task.company.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaRegClock />
              <span>{task.timeEstimate}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FaCalendarAlt />
            <span>Due: {task.deadline}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              Details
            </Button>
            <Button size="sm" variant="default" className="text-xs">
              Continue
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function RunningTasksPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  // Get unique categories, difficulties, and priorities from tasks
  const categories = ['all', ...new Set(mockTasks.map(task => task.category))];
  const difficulties = ['all', ...new Set(mockTasks.map(task => task.difficulty))];
  const priorities = ['all', ...new Set(mockTasks.map(task => task.priority))];
  
  // Filter and search tasks
  const filteredTasks = mockTasks.filter(task => {
    const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
    const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
    const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
    const searchMatch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && difficultyMatch && priorityMatch && statusMatch && searchMatch;
  });
  
  // Count tasks by status
  const inProgressCount = mockTasks.filter(task => task.status === 'in-progress').length;
  const completedCount = mockTasks.filter(task => task.status === 'completed').length;
  
  return (
    <div className={`${playfair.className} p-6`}>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white mb-1`}>
              Your Micro Tasks
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your progress across all assigned micro tasks
            </p>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              Completed: {completedCount}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              In Progress: {inProgressCount}
            </Badge>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tasks, skills, or companies..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[140px]">
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
                <SelectTrigger className="w-full sm:w-[140px]">
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
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority === 'all' ? 'All Priorities' : `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <Card className="bg-white dark:bg-dark-2 shadow-sm p-8 text-center">
            <CardContent>
              <div className="py-12">
                <FaExclamationTriangle className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Matching Tasks</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  There are no tasks matching your current filters. Try adjusting your filter criteria or check again later for new assignments.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedPriority('all');
                  setSelectedStatus('all');
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
