"use client";

import React, { useState, useEffect, use } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/language/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/components/toaster';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { 
  HiUsers, 
  HiClipboardList, 
  HiHome, 
  HiOutlineMenuAlt3, 
  HiX, 
  HiOfficeBuilding,
  HiOutlineChartBar,
  HiOutlineCog,
  HiShieldCheck,
  HiOutlineDatabase
} from 'react-icons/hi';

export default function AdminDashboardLayout({ children, params }) {
  // Create a client layout wrapper
  return <ClientAdminDashboardLayout params={params}>{children}</ClientAdminDashboardLayout>;
}

// Client component that handles all the rendering and state
function ClientAdminDashboardLayout({ children, params }) {
  // Properly unwrap params with React.use() to avoid the warning
  const unwrappedParams = use(params);
  const { id } = unwrappedParams || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();
  const { t } = useLanguage()
   
  useEffect(() => {
    setMounted(true);
    
    // Simulate loading admin data
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const sidebarItems = [
    {
      name: t('adminDashboard'),
      icon: <HiHome className="h-5 w-5" />,
      path: `/admin/dashboard/${id}`,
    },
    {
      name: t('manageCompanies'),
      icon: <HiOfficeBuilding className="h-5 w-5" />,
      path: `/admin/dashboard/${id}/manage-companies`,
    },
    {
      name: t('allTasks'),
      icon: <HiClipboardList className="h-5 w-5" />,
      path: `/admin/dashboard/${id}/all-tasks`,
    },
    {
      name: t('allStudents'),
      icon: <HiUsers className="h-5 w-5" />,
      path: `/admin/dashboard/${id}/all-students`,
    },
    {
      name: t('analytics'),
      icon: <HiOutlineChartBar className="h-5 w-5" />,
      path: `/admin/dashboard/${id}/analytics`,
    },
  ];
  
  // Create a consistent loading component that renders the same on both server and client
  const loadingComponent = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
      </div>
    </div>
  );
  
  // If not mounted yet or still loading, show the loading component
  if (!mounted || isLoading) {
    return loadingComponent;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white dark:bg-gray-800 shadow-md rounded-full"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <HiX className="h-5 w-5" />
          ) : (
            <HiOutlineMenuAlt3 className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Layout Container */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Mobile Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
                onClick={toggleSidebar}
              />
              
              {/* Sidebar Panel */}
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-xl flex flex-col h-full overflow-hidden"
              >
                {/* Admin Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="relative group">
                      <Avatar className="h-12 w-12 border-2 border-purple-500 ring-2 ring-purple-500/20 transition-all duration-200 group-hover:ring-4">
                        <AvatarImage src="/admin-avatar.png" alt="Admin" />
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          <HiShieldCheck className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <h1 className="font-bold text-xl truncate">{t('appName')} {t('adminDashboard')}</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('appName')} Admin</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="lg:hidden ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
                      onClick={toggleSidebar}
                    >
                      <HiX className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-8 px-4">
                  <ul className="space-y-4">
                    {sidebarItems.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <motion.li 
                          key={item.path}
                          whileHover={{ x: 6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link 
                            href={item.path} 
                            className={`
                              flex items-center px-5 py-3.5 rounded-lg transition-all duration-200
                              ${isActive 
                                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium" 
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                              }
                            `}
                          >
                            <span className={`flex-shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.icon}
                            </span>
                            <span className={`ml-4 text-left ${isActive ? 'font-medium' : ''}`}>{item.name}</span>
                            
                            {/* Active Indicator */}
                            {isActive && (
                              <motion.div 
                                layoutId="activeNavIndicator"
                                className="ml-auto w-1.5 h-5 bg-purple-500 rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-gray-700/30 shadow-sm">
                    <div className="flex items-center">
                      <HiOutlineCog className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="ml-2 text-sm font-medium">{t('adminSettings')}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      v1.0
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Mobile header */}
            <div className="lg:hidden mb-6 flex items-center">
              <div className="flex-1 ml-12">
                <h1 className="text-xl font-bold">{t('appName')} {t('adminDashboard')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('appName')} Admin</p>
              </div>
            </div>
            
            {/* Page content */}
            <div className="mt-4">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
