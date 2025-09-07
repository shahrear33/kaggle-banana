"use client"

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/language/LanguageContext'
import { Spinner } from '../ui/components/spinner'

export default function LanguageLoader({ children }) {
  const { isLoaded } = useLanguage()
  const [showLoader, setShowLoader] = useState(true)
  
  useEffect(() => {
    // Only show loader for a short time to avoid flashing
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!isLoaded && showLoader) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading translations...</p>
        </div>
      </div>
    )
  }
  
  return children
}
