"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function LinkItem({ 
  title, 
  leftIcon, 
  to, 
  variant = "default",
  className,
  ...props 
}) {
  const pathname = usePathname()
  const isActive = pathname === to

  const variants = {
    default: "flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors",
    primary: "flex items-center gap-3 px-4 py-3 bg-[#28A745] text-white rounded-lg",
    secondary: "flex items-center gap-3 px-4 py-3 bg-[#0EA5E9] text-white rounded-lg"
  }

  return (
    <Link 
      href={to}
      className={cn(
        variants[variant],
        isActive && "text-gray-900 dark:text-white",
        className
      )}
      {...props}
    >
      <span className="text-xl">
        {leftIcon}
      </span>
      <span className="text-sm font-medium">
        {title}
      </span>
    </Link>
  )
}
