"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { LuLayoutDashboard } from "react-icons/lu";
import { CgCompressLeft } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { FaCertificate, FaTasks, FaTrophy, FaVideo, FaCalendarAlt, FaLaptopCode } from "react-icons/fa";
import { Button } from '@/components/ui/components/button'
import LinkItem from '@/components/ui/components/LinkItem'
import Hero from '@/components/utils/Hero';
import Image from 'next/image';
import { Toaster } from "@/components/ui/components/toaster"
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language/LanguageContext'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { t } = useLanguage();

  const navItems = [
    {
      title: t("dashboard"),
      to: `/dashboard/${params.id}`,
      icon: <LuLayoutDashboard size={20} />,
    },
    {
      title: t("runningTasks"),
      to: `/dashboard/${params.id}/running-tasks`,
      icon: <FaTasks size={20} />,
    },
    {
      title: t("leaderboard"),
      to: `/dashboard/${params.id}/leaderboard`,
      icon: <FaTrophy size={20} />,
    },
    {
      title: t("certificates"),
      to: `/dashboard/${params.id}/certificates`,
      icon: <FaCertificate size={20} />,
    },
    {
      title: t("virtualSessions"),
      to: `/dashboard/${params.id}/virtual-sessions`,
      icon: <FaVideo size={20} />,
    },
    {
      title: t("workshopsEnrolled"),
      to: `/dashboard/${params.id}/workshops-enrolled`,
      icon: <FaLaptopCode size={20} />,
    },
  ]

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/')
  }
  
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    async function getProfile() {
      let token = localStorage.getItem("token")
      if (!token) {
        return
      }

      token = JSON.parse(token)
      const endpoint = process.env.NEXT_PUBLIC_ENDPOINT
      const response = await fetch(`${endpoint}/user/me`, {
        method: 'GET',
        headers : {'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.access_token,
        "ngrok-skip-browser-warning": "69420"
      }
    })
      const ans = await response.json()        
      setProfile(ans)   
    }
    getProfile()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-menu-secondary">
      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.aside 
          className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white dark:bg-dark-1 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-84px)] transition-all duration-300 ease-in-out`}
          initial={false}
          animate={{ width: isSidebarCollapsed ? 80 : 288 }}
        >
          {/* User Profile */}
          <div className={`p-4 ${isSidebarCollapsed ? 'flex justify-center' : 'border-b border-gray-200 dark:border-gray-800'}`}>
            {isSidebarCollapsed ? (
              <div className="flex justify-center">
                <Image 
                  src="/profile.png" 
                  alt="User" 
                  width={40} 
                  height={40} 
                  className="rounded-full border-2 border-primary/20"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2">
                <div className="relative">
                  <Image 
                    src="/profile.png" 
                    alt="User" 
                    width={48} 
                    height={48} 
                    className="rounded-full border-2 border-primary/20"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Student User</h3>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">
                      {t("level")} 2
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("developer")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <Link 
                  key={item.to}
                  href={item.to}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 rounded-lg transition-colors ${
                    pathname === item.to 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`${pathname === item.to ? 'text-primary' : ''}`}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className={`ml-3 ${pathname === item.to ? 'font-medium' : ''}`}>
                      {item.title}
                    </span>
                  )}
                </Link>
              ))}
              
              {/* Collapse Sidebar Button */}
              <button
                onClick={handleToggleSidebar}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} w-full px-3 py-2.5 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 mt-6`}
              >
                <span className="transform transition-transform duration-300" style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <CgCompressLeft size={20} />
                </span>
                {!isSidebarCollapsed && (
                  <span className="ml-3">{t("collapseSidebar")}</span>
                )}
              </button>
            </div>
          </nav>

          {/* Sign Out Button */}
          <div className={`p-4 ${isSidebarCollapsed ? '' : 'border-t border-gray-200 dark:border-gray-800'}`}>
            <button 
              onClick={handleSignOut}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} w-full px-3 py-2.5 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-red-500 dark:hover:text-red-400`}
            >
              <FiLogOut size={20} />
              {!isSidebarCollapsed && (
                <span className="ml-3">{t("signOut")}</span>
              )}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-menu-secondary overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
