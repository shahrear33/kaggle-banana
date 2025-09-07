"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/lib/language/LanguageContext'
import VideoCall from '@/components/video/VideoCall'
import { Button } from '@/components/ui/components/button'
import { FiArrowLeft } from 'react-icons/fi'
import { virtualSessions } from '@/lib/mock'

export default function VideoSessionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  const [sessionId, setSessionId] = useState(null)
  const [session, setSession] = useState(null)
  const [inCall, setInCall] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Get session ID from URL query params
    const id = searchParams.get('id')
    if (!id) {
      toast({
        title: "Error",
        description: "Session ID is missing. Redirecting to dashboard.",
        variant: "destructive"
      })
      
      // Redirect back after 2 seconds
      const timeout = setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
      return () => clearTimeout(timeout)
    }
    
    setSessionId(id)
    
    // Fetch session details - in a real app would be from API
    const fetchSessionDetails = async () => {
      try {
        setIsLoading(true)
        
        // Simulate API call
        // const response = await fetch(`/api/sessions/${id}`)
        // const data = await response.json()
        
        // For now, use mock data
        const sessionData = virtualSessions.find(s => s.id === parseInt(id))
        
        if (!sessionData) {
          throw new Error("Session not found")
        }
        
        setSession(sessionData)
      } catch (error) {
        console.error("Error fetching session details:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to load session details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSessionDetails()
  }, [searchParams, router, toast])
  
  const handleLeaveCall = () => {
    setInCall(false)
    
    // Show confirmation
    toast({
      title: "Left Session",
      description: "You have left the virtual session.",
      variant: "default"
    })
    
    // Redirect back to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">{t('Loading session...')}</p>
        </div>
      </div>
    )
  }
  
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">{t('Session Not Found')}</h2>
          <p className="text-muted-foreground">{t('The requested session could not be found.')}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            {t('Back to Dashboard')}
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Compact header with session info */}
      <div className="bg-background/80 backdrop-blur-sm z-10 border-b border-border py-2 px-4 absolute top-0 left-0 right-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleLeaveCall} className="gap-1.5 h-8 px-2.5">
              <FiArrowLeft className="h-4 w-4" />
              {t('Leave')}
            </Button>
            <div>
              <h1 className="text-sm font-semibold">{session.title}</h1>
              <p className="text-xs text-muted-foreground">
                {t('With')} {session.mentor.name} • {session.startTime} - {session.endTime}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {session.sessionType === 'group' ? (
              <div className="flex items-center gap-1">
                <span>{t('Group Session')}</span>
                {session.participants && <span>• {session.participants} {t('participants')}</span>}
              </div>
            ) : (
              <span>{t('One-on-one Session')}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Video call component - takes full screen height */}
      <motion.div 
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <VideoCall setInCall={setInCall} />
      </motion.div>
    </div>
  )
}
