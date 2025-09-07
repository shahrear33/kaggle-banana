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
import { Progress } from '@/components/ui/components/progress';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language/LanguageContext';
import { studentSubmissions } from '@/lib/mock';

// Icons
import { 
  HiUsers, 
  HiSearch, 
  HiFilter, 
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePhone,
  HiX,
  HiOutlineExclamation,
  HiOutlineBadgeCheck,
  HiOutlineExternalLink,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineEye
} from 'react-icons/hi';

export default function AllStudents({ params }) {
  const { id } = use(params) || {};
  
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Client-side rendering protection
  const [mounted, setMounted] = useState(false);
  
  // Extract unique students from the studentSubmissions array
  const extractUniqueStudents = useCallback(() => {
    const uniqueStudentsMap = new Map();
    
    studentSubmissions.forEach(submission => {
      if (!uniqueStudentsMap.has(submission.student.id)) {
        uniqueStudentsMap.set(submission.student.id, {
          ...submission.student,
          submissions: 1,
          lastSubmission: submission.submissionDate,
          tasks: [{
            id: submission.taskId,
            title: submission.taskTitle
          }],
          score: submission.score
        });
      } else {
        const existingStudent = uniqueStudentsMap.get(submission.student.id);
        
        // Update student info
        uniqueStudentsMap.set(submission.student.id, {
          ...existingStudent,
          submissions: existingStudent.submissions + 1,
          lastSubmission: new Date(submission.submissionDate) > new Date(existingStudent.lastSubmission) 
            ? submission.submissionDate 
            : existingStudent.lastSubmission,
          tasks: [...existingStudent.tasks, {
            id: submission.taskId,
            title: submission.taskTitle
          }],
          // Update score with average if available
          score: submission.score
            ? existingStudent.score
              ? (existingStudent.score + submission.score) / 2
              : submission.score
            : existingStudent.score
        });
      }
    });
    
    return Array.from(uniqueStudentsMap.values());
  }, []);
  
  // Students states
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    university: 'all_universities',
    year: 'all_years',
    major: 'all_majors'
  });
  
  // Action states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Calculate unique filter options
  const universities = useMemo(() => {
    if (!students.length) return [];
    const uniqueUniversities = [...new Set(students.map(student => student.university))];
    return uniqueUniversities.map(university => ({
      id: university,
      name: university
    }));
  }, [students]);
  
  const years = useMemo(() => {
    if (!students.length) return [];
    const uniqueYears = [...new Set(students.map(student => student.year))];
    return uniqueYears.sort().map(year => ({
      id: year,
      name: `Year ${year}`
    }));
  }, [students]);
  
  const majors = useMemo(() => {
    if (!students.length) return [];
    const uniqueMajors = [...new Set(students.map(student => student.major))];
    return uniqueMajors.map(major => ({
      id: major,
      name: major
    }));
  }, [students]);
  
  // Fetch students on component mount
  useEffect(() => {
    setMounted(true);
    
    try {
      const uniqueStudents = extractUniqueStudents();
      setStudents(uniqueStudents);
      setFilteredStudents(uniqueStudents);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load students');
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load students. Please try again.',
        variant: 'destructive'
      });
    }
  }, [toast, extractUniqueStudents]);
  
  // Apply all filters when any filter changes
  useEffect(() => {
    if (!students.length) return;
    
    let result = [...students];
    
    // Apply performance tab filter
    if (activeTab === 'high_performers') {
      result = result.filter(student => student.score && student.score >= 80);
    } else if (activeTab === 'active') {
      result = result.filter(student => student.submissions >= 3);
    }
    
    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.university.toLowerCase().includes(query) ||
        student.major.toLowerCase().includes(query)
      );
    }
    
    // Apply university filter
    if (filters.university && filters.university !== 'all_universities') {
      result = result.filter(student => student.university === filters.university);
    }
    
    // Apply year filter
    if (filters.year && filters.year !== 'all_years') {
      result = result.filter(student => student.year === parseInt(filters.year, 10));
    }
    
    // Apply major filter
    if (filters.major && filters.major !== 'all_majors') {
      result = result.filter(student => student.major === filters.major);
    }
    
    setFilteredStudents(result);
  }, [students, searchQuery, activeTab, filters]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setFilters({
      university: 'all_universities',
      year: 'all_years',
      major: 'all_majors'
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);
  
  // Handle actions
  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    setStudentDetailsOpen(true);
  };
  
  // Create a consistent loading component that matches on both server and client
  const loadingComponent = (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading students data...</p>
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
  
  // Empty state when no students are found
  if (filteredStudents.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <HiUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">{t('allStudents')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all student profiles, monitor progress, and provide assistance.
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
                placeholder="Search students..."
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
                <HiUsers className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No students found</h3>
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
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <HiUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">{t('allStudents')}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all student profiles, monitor progress, and provide assistance.
        </p>
      </motion.div>
      
      {/* Main content card */}
      <Card className="overflow-hidden">
        {/* Tabs and search bar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="high_performers">High Performers</TabsTrigger>
                <TabsTrigger value="active">Most Active</TabsTrigger>
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
                  placeholder="Search students..."
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
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              University
            </label>
            <Select
              value={filters.university}
              onValueChange={(value) => setFilters({...filters, university: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All universities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_universities">All universities</SelectItem>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <Select
              value={filters.year.toString()}
              onValueChange={(value) => setFilters({...filters, year: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_years">All years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Major
            </label>
            <Select
              value={filters.major}
              onValueChange={(value) => setFilters({...filters, major: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All majors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_majors">All majors</SelectItem>
                {majors.map((major) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Students table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Student</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => {
                // Calculate achievement status based on score
                let achievementBadge = null;
                if (student.score) {
                  if (student.score >= 90) {
                    achievementBadge = <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Outstanding</Badge>;
                  } else if (student.score >= 80) {
                    achievementBadge = <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Excellent</Badge>;
                  } else if (student.score >= 70) {
                    achievementBadge = <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Good</Badge>;
                  }
                }
                
                return (
                  <TableRow 
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/10"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div 
                            className="font-medium hover:text-green-600 cursor-pointer"
                            onClick={() => openStudentDetails(student)}
                          >
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {student.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <HiOutlineOfficeBuilding className="mr-1 text-gray-500" />
                        <span>{student.university}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <HiOutlineBookOpen className="mr-1 text-gray-500" />
                        <span>{student.major}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <HiOutlineAcademicCap className="mr-1" />
                        Year {student.year}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <HiOutlineDocumentText className="mr-1 text-gray-500" />
                        <span>{student.submissions} submissions</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {student.score ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{Math.round(student.score)}/100</span>
                            {achievementBadge}
                          </div>
                          <Progress value={student.score} className="h-1.5 w-24" />
                        </div>
                      ) : (
                        <span className="text-gray-500">Not available</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openStudentDetails(student)}
                        title="View details"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </Button>
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
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} students
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
              Page {currentPage} of {totalPages || 1}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Student details dialog */}
      <Dialog open={studentDetailsOpen} onOpenChange={setStudentDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Student Profile</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Student ID: {selectedStudent.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center p-4 border rounded-md dark:border-gray-700">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                      <AvatarFallback className="text-2xl">{selectedStudent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedStudent.university}</p>
                    <div className="mt-3 flex justify-center">
                      {selectedStudent.score && selectedStudent.score >= 80 && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <HiOutlineBadgeCheck className="mr-1" />
                          High Performer
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Academic Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Major:</span>
                        <span className="font-medium">{selectedStudent.major}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Year:</span>
                        <span className="font-medium">{selectedStudent.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Submissions:</span>
                        <span className="font-medium">{selectedStudent.submissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg. Score:</span>
                        <span className="font-medium">
                          {selectedStudent.score ? `${Math.round(selectedStudent.score)}/100` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mt-0.5">
                            <HiOutlineDocumentText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Last submission</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedStudent.lastSubmission).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tasks Completed</h3>
                    <Card>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Task Title</span>
                          <span className="text-sm text-gray-500">Task ID</span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-48 overflow-y-auto">
                        {selectedStudent.tasks.map((task) => (
                          <div key={task.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900/10">
                            <div className="flex justify-between items-center">
                              <span>{task.title}</span>
                              <Badge variant="outline">{task.id}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStudentDetailsOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
