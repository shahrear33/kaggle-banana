"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/lib/language/LanguageContext'
import { format } from 'date-fns'
import Link from 'next/link'

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/components/card'
import { Badge } from '@/components/ui/components/badge'
import { Button } from '@/components/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/components/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/components/dialog'
import { Input } from '@/components/ui/components/input'
import { Label } from '@/components/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select'
import { Calendar } from '@/components/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/components/popover'

// Icons
import { FaVideo, FaCalendarAlt, FaClock, FaUserFriends, FaPlus, FaRegCalendarPlus } from 'react-icons/fa'
import { MdOutlineRescheduleLater, MdVideoCall } from 'react-icons/md'
import { AiOutlineSchedule } from "react-icons/ai";
import { HiOutlineExternalLink } from 'react-icons/hi'
import { BsPeople, BsPersonFill } from 'react-icons/bs'
import { CalendarIcon } from 'lucide-react'

// Mock Data
import { getMockVirtualSessions } from '@/lib/mock'

// Utilities
import { cn } from '@/lib/utils'

export default function VirtualSessionsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false)
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    sessionType: 'one-on-one',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    mentorName: '',
    description: ''
  })
  
  useEffect(() => {
    // Fetch sessions - in a real app this would be from an API
    const fetchSessions = async () => {
      try {
        setIsLoading(true)
        // In a real app, we would fetch from an API
        // const response = await fetch(`/api/sessions/${params.id}`)
        // const data = await response.json()
        
        // For now, use mock data
        const mockSessions = getMockVirtualSessions(params.id)
        setSessions(mockSessions)
      } catch (error) {
        console.error('Error fetching sessions:', error)
        toast({
          title: "Error",
          description: "Failed to load virtual sessions. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSessions()
  }, [params.id, toast])
  
  const handleStartSession = (sessionId) => {
    // Navigate to the video call page
    router.push(`/video-session?id=${sessionId}`)
  }
  
  const handleCreateSession = () => {
    // In a real app, this would make an API call to create a new session
    const newSession = {
      id: sessions.length + 1,
      title: newSessionData.title,
      sessionType: newSessionData.sessionType,
      date: newSessionData.date,
      startTime: newSessionData.startTime,
      endTime: newSessionData.endTime,
      mentor: {
        id: 999,
        name: newSessionData.mentorName,
        position: "Mentor",
        company: "TryShip",
        avatar: "/avatars/default.png"
      },
      description: newSessionData.description,
      status: "scheduled",
      meetingUrl: `/video-session?id=${sessions.length + 1}`
    }
    
    // Add participants if it's a group session
    if (newSessionData.sessionType === 'group') {
      newSession.participants = 1
    }
    
    // Add the new session to the list
    setSessions([...sessions, newSession])
    
    // Close the dialog
    setShowNewSessionDialog(false)
    
    // Reset form data
    setNewSessionData({
      title: '',
      sessionType: 'one-on-one',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      mentorName: '',
      description: ''
    })
    
    // Show success notification
    toast({
      title: "Success!",
      description: "New virtual session scheduled successfully.",
      variant: "success"
    })
  }
  
  // Filter for upcoming sessions
  const upcomingSessions = sessions.filter(session => session.status === 'scheduled')
  
  // Filter for past sessions
  const pastSessions = sessions.filter(session => session.status === 'completed')
  
  // Loading component
  const LoadingComponent = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
  
  // Session card component
  const SessionCard = ({ session }) => {
    const isUpcoming = session.status === 'scheduled'
    const sessionDate = new Date(session.date)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`hover:shadow-md transition-shadow ${!isUpcoming ? 'opacity-85' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FaVideo className={isUpcoming ? "text-primary" : "text-gray-400"} />
                {session.title}
              </CardTitle>
              <Badge 
                className={isUpcoming 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                  : undefined
                }
                variant={isUpcoming ? "default" : "outline"}
              >
                {isUpcoming ? t('Upcoming') : t('Completed')}
              </Badge>
            </div>
            <CardDescription>
              {session.sessionType === 'one-on-one' ? t('One-on-one mentoring session') : t('Group mentoring session')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FaCalendarAlt />
                  <span>{format(sessionDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FaClock />
                  <span>{session.startTime} - {session.endTime}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                  <AvatarFallback>{session.mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{session.mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{session.mentor.position}, {session.mentor.company}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {session.description}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {session.sessionType === 'one-on-one' ? (
                <>
                  <BsPersonFill />
                  <span>{t('1-on-1')}</span>
                </>
              ) : (
                <>
                  <BsPeople />
                  <span>{t('Group')} ({session.participants})</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {isUpcoming ? (
                <>
                  <Button size="sm" variant="outline" className="gap-1">
                    <AiOutlineSchedule className="h-4 w-4" />
                    {t('Reschedule')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="gap-1"
                    onClick={() => handleStartSession(session.id)}
                  >
                    <MdVideoCall className="h-4 w-4" />
                    {t('Join Now')}
                  </Button>
                </>
              ) : (
                <>
                  {session.recording && (
                    <Button size="sm" variant="outline" className="gap-1" asChild>
                      <Link href={session.recording} target="_blank">
                        <HiOutlineExternalLink className="h-4 w-4" />
                        {t('View Recording')}
                      </Link>
                    </Button>
                  )}
                  {!session.feedback?.given && (
                    <Button size="sm" variant="outline">
                      {t('Leave Feedback')}
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  // New Session Dialog
  const NewSessionDialog = () => (
    <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <FaPlus className="h-4 w-4" />
          {t('New Session')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{t('Schedule New Virtual Session')}</DialogTitle>
          <DialogDescription>
            {t('Fill in the details to schedule a new virtual mentoring session.')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('Session Title')}</Label>
            <Input 
              id="title" 
              value={newSessionData.title} 
              onChange={(e) => setNewSessionData({...newSessionData, title: e.target.value})} 
              placeholder={t('e.g. Career Strategy Discussion')} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sessionType">{t('Session Type')}</Label>
            <Select 
              value={newSessionData.sessionType}
              onValueChange={(value) => setNewSessionData({...newSessionData, sessionType: value})}
            >
              <SelectTrigger id="sessionType">
                <SelectValue placeholder={t('Select session type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-on-one">{t('One-on-One')}</SelectItem>
                <SelectItem value="group">{t('Group Session')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>{t('Date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newSessionData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newSessionData.date ? format(newSessionData.date, "PPP") : <span>{t('Pick a date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newSessionData.date}
                  onSelect={(date) => setNewSessionData({...newSessionData, date})}                  
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">{t('Start Time')}</Label>
              <Input 
                id="startTime" 
                type="time" 
                value={newSessionData.startTime} 
                onChange={(e) => setNewSessionData({...newSessionData, startTime: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">{t('End Time')}</Label>
              <Input 
                id="endTime" 
                type="time" 
                value={newSessionData.endTime} 
                onChange={(e) => setNewSessionData({...newSessionData, endTime: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="mentorName">{t('Mentor Name')}</Label>
            <Input 
              id="mentorName" 
              value={newSessionData.mentorName} 
              onChange={(e) => setNewSessionData({...newSessionData, mentorName: e.target.value})} 
              placeholder={t('e.g. John Smith')} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">{t('Description')}</Label>
            <Input 
              id="description" 
              value={newSessionData.description} 
              onChange={(e) => setNewSessionData({...newSessionData, description: e.target.value})} 
              placeholder={t('Brief description of the session')} 
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('Cancel')}</Button>
          </DialogClose>
          <Button onClick={handleCreateSession} disabled={!newSessionData.title || !newSessionData.mentorName}>
            {t('Schedule')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {t('Virtual Sessions')}
            </h1>
            <p className="text-muted-foreground">
              {t('Schedule and join virtual mentoring sessions with industry professionals.')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FaCalendarAlt className="h-4 w-4" />
              {t('View Calendar')}
            </Button>
            <NewSessionDialog />
          </div>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-2">
              <FaRegCalendarPlus className="h-4 w-4" />
              {t('Upcoming')} ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <FaCalendarAlt className="h-4 w-4" />
              {t('Past')} ({pastSessions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              <LoadingComponent />
            ) : upcomingSessions.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-muted">
                <FaCalendarAlt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('No Upcoming Sessions')}</h3>
                <p className="text-muted-foreground mb-6">{t('You don\'t have any upcoming virtual sessions scheduled yet.')}</p>
                <Button onClick={() => setShowNewSessionDialog(true)} className="gap-2">
                  <FaPlus className="h-4 w-4" />
                  {t('Schedule Your First Session')}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {isLoading ? (
              <LoadingComponent />
            ) : pastSessions.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-muted">
                <FaCalendarAlt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('No Past Sessions')}</h3>
                <p className="text-muted-foreground">{t('You haven\'t completed any virtual sessions yet.')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pastSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
