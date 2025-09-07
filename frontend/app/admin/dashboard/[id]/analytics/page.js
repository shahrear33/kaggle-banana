"use client";

import React, { useState, useEffect, use, useMemo } from 'react';
import { Card } from '@/components/ui/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import { Badge } from '@/components/ui/components/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language/LanguageContext';
import { getAdminDashboardData } from '@/lib/mock';

// Charts
import { 
  BarChart, Bar, 
  LineChart, Line, 
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// Icons
import {
  HiOutlineChartBar,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineUserCircle,
  HiOutlineCash,
  HiArrowUp,
  HiArrowDown,
  HiOutlineTrendingUp,
  HiOutlineCalendar
} from 'react-icons/hi';

export default function Analytics({ params }) {
  const { id } = use(params) || {};
  
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Client-side rendering protection
  const [mounted, setMounted] = useState(false);
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Time period for analytics
  const [timePeriod, setTimePeriod] = useState('month'); // month, quarter, year
  
  // Active tab for detailed analytics
  const [activeTab, setActiveTab] = useState('overview');
  
  // Generate chart color palette
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
    '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
  ];
  
  // Fetch dashboard data
  useEffect(() => {
    setMounted(true);
    
    try {
      // In a real implementation, this would be an API call
      const data = getAdminDashboardData();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || 'Failed to load analytics data');
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data. Please try again.',
        variant: 'destructive'
      });
    }
  }, [toast]);
  
  // Generate monthly data for time-series charts
  const generateMonthlyData = (baseValue, growth, months = 12) => {
    const data = [];
    let currentValue = baseValue - (baseValue * growth / 100 * 0.7);
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      // Add some randomness to make the chart look more realistic
      const randomFactor = 0.85 + Math.random() * 0.3; 
      currentValue = i === 0 ? baseValue : currentValue * (1 + (growth / 100) / (months - 1) * randomFactor);
      
      data.push({
        name: monthName,
        value: Math.round(currentValue)
      });
    }
    
    return data;
  };
  
  // Calculate quarterly data
  const generateQuarterlyData = (baseValue, growth, quarters = 4) => {
    const data = [];
    let currentValue = baseValue - (baseValue * growth / 100 * 0.8);
    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    
    for (let i = quarters - 1; i >= 0; i--) {
      let quarter = currentQuarter - i;
      let year = new Date().getFullYear();
      
      if (quarter <= 0) {
        quarter += 4;
        year -= 1;
      }
      
      // Add some randomness
      const randomFactor = 0.9 + Math.random() * 0.2;
      currentValue = i === 0 ? baseValue : currentValue * (1 + (growth / 100) / quarters * randomFactor);
      
      data.push({
        name: `Q${quarter} ${year}`,
        value: Math.round(currentValue)
      });
    }
    
    return data;
  };
  
  // Calculate yearly data
  const generateYearlyData = (baseValue, growth, years = 3) => {
    const data = [];
    let currentValue = baseValue - (baseValue * growth / 100 * years * 0.8);
    const currentYear = new Date().getFullYear();
    
    for (let i = years - 1; i >= 0; i--) {
      const year = currentYear - i;
      
      // Add some randomness
      const randomFactor = 0.95 + Math.random() * 0.1;
      currentValue = i === 0 ? baseValue : currentValue * (1 + (growth / 100) * randomFactor);
      
      data.push({
        name: year.toString(),
        value: Math.round(currentValue)
      });
    }
    
    return data;
  };
  
  // Generate chart data based on selected time period
  const getTimeSeriesData = (baseValue, growth) => {
    switch (timePeriod) {
      case 'month':
        return generateMonthlyData(baseValue, growth);
      case 'quarter':
        return generateQuarterlyData(baseValue, growth);
      case 'year':
        return generateYearlyData(baseValue, growth);
      default:
        return generateMonthlyData(baseValue, growth);
    }
  };
  
  // Create a consistent loading component that matches on both server and client
  const loadingComponent = (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading analytics data...</p>
      </div>
    </div>
  );
  
  // Only animate after client-side hydration completes and data is loaded
  if (!mounted || loading) {
    return loadingComponent;
  }
  
  // Show error state if data fetching failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <HiOutlineChartBar className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('error')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <HiOutlineChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">{t('analytics')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View platform performance metrics, user engagement, and business insights.
          </p>
        </div>
        
        {/* Time period selector */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
          <HiOutlineCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Select
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value)}
          >
            <SelectTrigger className="w-44 border-none shadow-none">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">{t('last_12_months')}</SelectItem>
              <SelectItem value="quarter">{t('last_4_quarters')}</SelectItem>
              <SelectItem value="year">{t('last_3_years')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Companies KPI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4 h-full">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('companies')}</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData?.platformStats.companies.total}</h3>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 font-medium">
                    <HiArrowUp className="h-3 w-3" />
                    {dashboardData?.platformStats.companies.growth}%
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('vs_prev_period')}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <HiOutlineOfficeBuilding className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimeSeriesData(dashboardData?.platformStats.companies.total, dashboardData?.platformStats.companies.growth)}>
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="#3b82f680" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        {/* Students KPI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-4 h-full">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('students')}</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData?.platformStats.students.total}</h3>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 font-medium">
                    <HiArrowUp className="h-3 w-3" />
                    {dashboardData?.platformStats.students.growth}%
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('vs_prev_period')}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <HiOutlineUserGroup className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimeSeriesData(dashboardData?.platformStats.students.total, dashboardData?.platformStats.students.growth)}>
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf680" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        {/* Tasks KPI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-4 h-full">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('tasks')}</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData?.platformStats.tasks.total}</h3>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 font-medium">
                    <HiArrowUp className="h-3 w-3" />
                    {dashboardData?.platformStats.tasks.growth}%
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('vs_prev_period')}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <HiOutlineClipboardList className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimeSeriesData(dashboardData?.platformStats.tasks.total, dashboardData?.platformStats.tasks.growth)}>
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="#10b98180" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        {/* Workshops KPI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-4 h-full">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('workshops')}</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData?.platformStats.workshops.total}</h3>
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 font-medium">
                    <HiArrowUp className="h-3 w-3" />
                    {dashboardData?.platformStats.workshops.growth}%
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('vs_prev_period')}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <HiOutlineCalendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimeSeriesData(dashboardData?.platformStats.workshops.total, dashboardData?.platformStats.workshops.growth)}>
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="#f59e0b80" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Analytics Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-6"
      >
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="companies">{t('companies')}</TabsTrigger>
            <TabsTrigger value="students">{t('students')}</TabsTrigger>
            <TabsTrigger value="tasks">{t('tasks')}</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Growth Chart */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('platform_growth')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getTimeSeriesData(
                        (dashboardData?.platformStats.companies.total + 
                         dashboardData?.platformStats.students.total / 10 + 
                         dashboardData?.platformStats.tasks.total / 2) / 3, 
                        20
                      )}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                        name="Growth"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              {/* Student Distribution by Year */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('student_distribution')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.platformStats.students.byYear}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              {/* Tasks by Category */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('tasks_by_category')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData?.platformStats.tasks.byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData?.platformStats.tasks.byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [value, props.payload.name]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              {/* Industries Distribution */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('industries_distribution')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dashboardData?.platformStats.companies.industries}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="name" stroke="#6b7280" />
                      <PolarRadiusAxis stroke="#6b7280" />
                      <Radar
                        name="Companies"
                        dataKey="count"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Companies Tab */}
          <TabsContent value="companies" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('companies_by_industry')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.platformStats.companies.industries}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Companies" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('company_verification_status')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Verified', value: dashboardData?.platformStats.companies.verified },
                          { name: 'Pending', value: dashboardData?.platformStats.companies.pending }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Students Tab */}
          <TabsContent value="students" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('students_by_university')}</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.platformStats.students.byUniversity}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 130, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#6b7280" 
                        width={125}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('student_activity_status')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Active', value: dashboardData?.platformStats.students.active },
                          { name: 'Inactive', value: dashboardData?.platformStats.students.inactive }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('tasks_by_difficulty')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.platformStats.tasks.byDifficulty}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="difficulty" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Tasks">
                        {dashboardData?.platformStats.tasks.byDifficulty.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.difficulty === 'Beginner' ? '#10b981' : 
                                  entry.difficulty === 'Intermediate' ? '#f59e0b' : 
                                  '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('task_status')}</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Active', value: dashboardData?.platformStats.tasks.active },
                          { name: 'Completed', value: dashboardData?.platformStats.tasks.completed }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#3b82f6" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
