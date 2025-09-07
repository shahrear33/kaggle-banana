"use client";

import React, { useState, useEffect, use, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/components/card';
import { Input } from '@/components/ui/components/input';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/components/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/components/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import { Checkbox } from '@/components/ui/components/checkbox';
import { Progress } from '@/components/ui/components/progress';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language/LanguageContext';
import { microTasks } from '@/lib/mock';
import { format } from 'date-fns';

// Icons
import { 
  HiClipboardList, 
  HiSearch, 
  HiFilter, 
  HiClock, 
  HiCheck, 
  HiX, 
  HiOutlineExclamation,
  HiOutlineBadgeCheck,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineTag,
  HiOutlineExternalLink,
  HiOutlineCode,
  HiOutlineDatabase,
  HiOutlineLockClosed,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineEye
} from 'react-icons/hi';

export default function AllTasks({ params }) {
  const { id } = use(params) || {};
  
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Client-side rendering protection
  const [mounted, setMounted] = useState(false);
  
  // Task states
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    difficulty: 'all_difficulties',
    category: 'all_categories',
    completionStatus: 'all_status',
    dateRange: 'all_time'
  });
  
  // Action states
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Difficulty levels for filtering
  const difficultyLevels = [
    { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    { id: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: 'advanced', label: 'Advanced', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    { id: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
  ];
  
  // Categories for filtering
  const categories = [
    { id: 'frontend', label: 'Frontend', icon: <HiOutlineCode className="mr-1" /> },
    { id: 'backend', label: 'Backend', icon: <HiOutlineDatabase className="mr-1" /> }, 
    { id: 'design', label: 'Design', icon: <HiOutlinePencilAlt className="mr-1" /> },
    { id: 'database', label: 'Database', icon: <HiOutlineDatabase className="mr-1" /> },
    { id: 'security', label: 'Security', icon: <HiOutlineLockClosed className="mr-1" /> }
  ];
  
  // Fetch tasks on component mount
  useEffect(() => {
    setMounted(true);
    
    // In a real implementation, we would fetch from an API
    // For now, we'll use the mock data
    try {
      setTasks(microTasks);
      setFilteredTasks(microTasks);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Apply all filters when any filter changes
  useEffect(() => {
    if (!tasks.length) return;
    
    let result = [...tasks];
    
    // Apply active tab filter
    if (activeTab === 'active') {
      result = result.filter(task => task.is_active);
    } else if (activeTab === 'inactive') {
      result = result.filter(task => !task.is_active);
    }
    
    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.created_by_name.toLowerCase().includes(query)
      );
    }
    
    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all_difficulties') {
      result = result.filter(task => task.difficulty === filters.difficulty);
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all_categories') {
      result = result.filter(task => task.category === filters.category);
    }
    
    // Apply completion status filter
    if (filters.completionStatus && filters.completionStatus !== 'all_status') {
      if (filters.completionStatus === 'filled') {
        result = result.filter(task => task.completed_count >= task.max_submissions);
      } else if (filters.completionStatus === 'available') {
        result = result.filter(task => task.completed_count < task.max_submissions);
      }
    }
    
    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all_time') {
      const now = new Date();
      let dateLimit;
      
      switch (filters.dateRange) {
        case 'last7days':
          dateLimit = new Date(now.setDate(now.getDate() - 7));
          result = result.filter(task => new Date(task.creation_date) >= dateLimit);
          break;
        case 'last30days':
          dateLimit = new Date(now.setDate(now.getDate() - 30));
          result = result.filter(task => new Date(task.creation_date) >= dateLimit);
          break;
        case 'last90days':
          dateLimit = new Date(now.setDate(now.getDate() - 90));
          result = result.filter(task => new Date(task.creation_date) >= dateLimit);
          break;
        default:
          break;
      }
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, activeTab, filters]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setFilters({
      difficulty: 'all_difficulties',
      category: 'all_categories',
      completionStatus: 'all_status',
      dateRange: 'all_time'
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, currentPage, pageSize]);
  
  // Handle actions
  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };
  
  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteTask = () => {
    // In a real implementation, this would call an API
    if (taskToDelete) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      
      toast({
        title: 'Task Deleted',
        description: `"${taskToDelete.title}" has been deleted successfully.`,
        variant: 'default'
      });
    }
  };
  
  const handleToggleTaskStatus = (taskId, currentStatus) => {
    // In a real implementation, this would call an API
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, is_active: !currentStatus } : task
      )
    );
    
    toast({
      title: `Task ${currentStatus ? 'Deactivated' : 'Activated'}`,
      description: `Task status has been updated successfully.`,
      variant: 'default'
    });
  };
  
  // Create a consistent loading component that matches on both server and client
  const loadingComponent = (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading tasks...</p>
      </div>
    </div>
  );
  
  // Only animate after client-side hydration completes
  if (!mounted || loading) {
    return loadingComponent;
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <HiOutlineExclamation className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('error')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            {t('retry')}
          </Button>
        </div>
      </div>
    );
  }
  
  // Empty state when no tasks are found
  if (filteredTasks.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
              <HiClipboardList className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold">{t('allTasks')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor, manage, and moderate all micro-tasks posted by companies.
          </p>
        </motion.div>
        
        <Card className="p-6">
          <div className="flex justify-between mb-4">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 pr-4"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={resetFilters}
            >
              <HiX className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <HiClipboardList className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No tasks found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
              <Button 
                onClick={resetFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
            <HiClipboardList className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold">{t('allTasks')}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor, manage, and moderate all micro-tasks posted by companies.
        </p>
      </motion.div>
      
      {/* Main content card */}
      <Card className="overflow-hidden">
        {/* Tabs and search bar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10 pr-4"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={resetFilters}
              >
                <HiX className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => setFilters({...filters, difficulty: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_difficulties">All difficulties</SelectItem>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({...filters, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      {category.icon}
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Completion Status
            </label>
            <Select
              value={filters.completionStatus}
              onValueChange={(value) => setFilters({...filters, completionStatus: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_status">Any status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters({...filters, dateRange: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_time">All time</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tasks table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => {
                // Find the difficulty level to get its color
                const difficultyLevel = difficultyLevels.find(d => d.id === task.difficulty);
                const difficultyColor = difficultyLevel?.color || 'bg-gray-100 text-gray-800';
                
                // Find the category to get its icon
                const category = categories.find(c => c.id === task.category);
                const categoryIcon = category?.icon || null;
                
                // Calculate completion percentage
                const completionPercentage = Math.round((task.completed_count / task.max_submissions) * 100);
                
                return (
                  <TableRow 
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/10"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <div 
                          className="font-medium hover:text-amber-600 cursor-pointer"
                          onClick={() => openTaskDetails(task)}
                        >
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {task.description.length > 80 ? task.description.substring(0, 80) + '...' : task.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <HiOutlineCalendar className="inline-block mr-1" />
                          Created: {format(new Date(task.creation_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.company_logo} alt={task.created_by_name} />
                          <AvatarFallback>{task.created_by_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{task.created_by_name}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={difficultyColor}>
                        {difficultyLevel?.label || task.difficulty}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {categoryIcon}
                        {category?.label || task.category}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary">
                        <HiOutlineChartBar className="mr-1 inline" />
                        {task.points} pts
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={task.is_active ? "default" : "destructive"}
                        className={task.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
                      >
                        {task.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-xs">
                          <span>{task.completed_count}/{task.max_submissions}</span>
                          <span>{completionPercentage}%</span>
                        </div>
                        <Progress value={completionPercentage} />
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openTaskDetails(task)}
                          title="View details"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleTaskStatus(task.id, task.is_active)}
                          title={task.is_active ? "Deactivate task" : "Activate task"}
                        >
                          {task.is_active ? 
                            <HiX className="h-4 w-4 text-red-500" /> : 
                            <HiCheck className="h-4 w-4 text-green-500" />}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(task)}
                          title="Delete task"
                        >
                          <HiOutlineTrash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredTasks.length)} of {filteredTasks.length} tasks
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
            
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Task details dialog */}
      <Dialog open={taskDetailsOpen} onOpenChange={setTaskDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedTask.title}</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Task ID: {selectedTask.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedTask.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.required_skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedTask.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-md dark:border-gray-700">
                          <div className="flex-1">
                            <div className="font-medium">{attachment.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{attachment.description}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            <HiOutlineExternalLink className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 border rounded-md dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedTask.company_logo} alt={selectedTask.created_by_name} />
                        <AvatarFallback>{selectedTask.created_by_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedTask.created_by_name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Company ID: {selectedTask.created_by_id}</div>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <HiOutlineOfficeBuilding className="mr-2 h-4 w-4" />
                      View Company Profile
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                      <Badge 
                        className={difficultyLevels.find(d => d.id === selectedTask.difficulty)?.color || ''}
                      >
                        {difficultyLevels.find(d => d.id === selectedTask.difficulty)?.label || selectedTask.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <Badge variant="outline" className="flex items-center">
                        {categories.find(c => c.id === selectedTask.category)?.icon}
                        {categories.find(c => c.id === selectedTask.category)?.label || selectedTask.category}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Points:</span>
                      <Badge variant="secondary">{selectedTask.points}</Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <Badge 
                        variant={selectedTask.is_active ? "default" : "destructive"}
                        className={selectedTask.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
                      >
                        {selectedTask.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span>{format(new Date(selectedTask.creation_date), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                      <span>{format(new Date(selectedTask.deadline), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Hours:</span>
                      <span>{selectedTask.estimated_hours} hours</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                      <span>{selectedTask.completed_count}/{selectedTask.max_submissions}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{Math.round((selectedTask.completed_count / selectedTask.max_submissions) * 100)}%</span>
                      </div>
                      <Progress value={(selectedTask.completed_count / selectedTask.max_submissions) * 100} />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setTaskDetailsOpen(false);
                      confirmDelete(selectedTask);
                    }}
                  >
                    <HiOutlineTrash className="mr-2 h-4 w-4" />
                    Delete Task
                  </Button>
                </div>
                
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setTaskDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  
                  <Button
                    onClick={() => {
                      handleToggleTaskStatus(selectedTask.id, selectedTask.is_active);
                      setTaskDetailsOpen(false);
                    }}
                  >
                    {selectedTask.is_active ? 'Deactivate Task' : 'Activate Task'}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the task "{taskToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
