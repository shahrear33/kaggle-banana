"use client"
import { useLanguage } from '@/lib/language/LanguageContext'
import { Quicksand, Poppins, Lato } from 'next/font/google'
import { Toaster } from '@/components/ui/components/toaster'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/components/card'
import { Input } from '@/components/ui/components/input'
import { Badge } from '@/components/ui/components/badge'
import { Button } from '@/components/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/components/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar'
import Link from 'next/link'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaLaptopCode, FaTrophy, FaSearch, FaFilter, FaTag } from 'react-icons/fa'
import api from '@/axiosInstance';

// Import mock data (will be replaced with API calls later)
import { events as mockEvents } from '@/lib/mock'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

export default function WorkshopsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all'); // 'all', 'workshop', 'hackathon'
  const [tagFilter, setTagFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState(new Set());
  
  // Get unique tags for filter
  const allTags = events.flatMap(event => event.tags || []);
  const uniqueTags = [...new Set(allTags)];
  
  // Filter function
  const filterEvents = () => {
    let filtered = [...events];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organized_by_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.tags && event.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }
    
    // Apply event type filter
    if (eventType !== 'all') {
      filtered = filtered.filter(event => event.event_type === eventType);
    }
    
    // Apply tag filter
    if (tagFilter && tagFilter !== 'all') {
      filtered = filtered.filter(event => 
        event.tags && event.tags.includes(tagFilter)
      );
    }

    // jamal
    // if (tagFilter && tagFilter !== 'all' && selectedTags.length > 0) {
    //   filtered = filtered.filter(event =>
    //     event.tags && selectedTags.some(selectedTag => event.tags.includes(selectedTag))
    //   );
    // }
    
    setFilteredEvents(filtered);
  };
  
  // Effect for filtering
  useEffect(() => {
    filterEvents();
  }, [searchTerm, eventType, tagFilter, events]);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Call the events API endpoint
        const response = await api.get('/events/', {
          params: {
            skip: 0,
            limit: 20,
            event_type: 'workshop',
            is_active: true
          }
        });
        
        // Check if we have valid data
        if (response?.data && Array.isArray(response.data)) {
          // Process API data and add fallbacks for null values
          const processedData = response.data.map(event => ({
            id: event?.id ?? Math.random().toString(36).substr(2, 9),
            title: event?.title ?? 'Unnamed Event',
            description: event?.description ?? 'No description available',
            event_type: event?.event_type ?? 'workshop',
            start_date: event?.start_date ?? new Date().toISOString(),
            end_date: event?.end_date ?? new Date().toISOString(),
            registration_deadline: event?.registration_deadline ?? new Date().toISOString(),
            location: event?.location ?? 'Online',
            meeting_link: event?.meeting_link ?? '',
            max_participants: event?.max_participants ?? 0,
            max_team_size: event?.max_team_size ?? null,
            is_active: event?.is_active ?? true,
            prizes: event?.prizes ?? null,
            organized_by_name: event?.organized_by?.company_name ?? 'Unknown Organizer',
            organized_by_id: event?.organized_by?.id ?? 0,
            tags: event?.required_skills?.map(skill => skill) ?? [],
            materials: event?.materials ?? [],
            participant_count: event?.participant_count ?? 0,
            cover_image_url: event?.cover_image_url ?? null
          }));
          
          setEvents(processedData);
          console.log('Fetched events from API:', processedData);
        } else {
          // Fallback to mock data if API returns invalid data
          console.warn('Invalid data format from API, using mock data instead');
          setEvents(mockEvents);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
        
        // Fallback to mock data on error
        console.warn('Error fetching from API, using mock data instead');
        setEvents(mockEvents);
        
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load events data from API. Using sample data instead.",
          variant: "warning"
        });
      }
    };
    
    fetchEvents();
  }, [toast]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <main className={`${playfair.className} mt-4 w-full overflow-hidden scrollbar-hidden min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800`}>
      <Toaster />
      <section className='h-full w-[90%] mx-auto p-8 bg-white dark:bg-slate-900 rounded-xl shadow-xl'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8'
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className={`${poppins.className} text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
                Workshops & Hackathons
              </h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Join industry-led events to enhance your skills and expand your network
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-[250px] border-indigo-200 dark:border-indigo-900 focus:ring-indigo-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
              </div>
              <div className="flex gap-2">
                <Tabs defaultValue="all" value={eventType} onValueChange={setEventType} className="w-full sm:w-auto">
                  <TabsList className="grid grid-cols-3 w-full sm:w-[280px] bg-indigo-100 dark:bg-indigo-900/30">
                    <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">All Events</TabsTrigger>
                    <TabsTrigger value="workshop" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Workshops</TabsTrigger>
                    <TabsTrigger value="hackathon" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Hackathons</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Tag Filter */}
          {uniqueTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge 
                variant={tagFilter === 'all' ? 'primary' : 'outline'} 
                className={`cursor-pointer ${tagFilter === 'all' ? 'bg-indigo-600' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/20'}`}
                onClick={() => setTagFilter('all')}
              >
                All Tags
              </Badge>
              {uniqueTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant={tagFilter === tag ? 'primary' : 'outline'}
                  className={`cursor-pointer ${tagFilter === tag ? 'bg-indigo-600' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/20'}`}
                  onClick={() => {
                    setTagFilter(tag)

                    // jamal
                    // setSelectedTags((prev) => new Set([...prev, tag]))
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Loading and Error States */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white dark:bg-slate-800 rounded-xl p-6 h-64 shadow-md"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="text-red-500 mb-4 text-xl"><FaLaptopCode className="inline-block mr-2" /> Error loading events</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <>
              {/* Results summary */}
              <div className="flex items-center mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                  {eventType !== 'all' && <span> of type <Badge className="ml-1 capitalize bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">{eventType}</Badge></span>}
                  {tagFilter && tagFilter !== 'all' && <span> with tag <Badge className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">{tagFilter}</Badge></span>}

                  {/*Jamal*/}
                  {/* {tagFilter && tagFilter !== 'all' && selectedTags.length>0 && (
                    <span>
                      with tags {selectedTags.map((tag, index) => (
                        <Badge key={tag} className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                          {tag}
                          {index < selectedTags.length-1 && <span className="mx-1">,</span>}
                        </Badge>
                      ))}
                    </span>
                  )} */}
                </div>
                {(eventType !== 'all' || tagFilter || searchTerm) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-4 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    onClick={() => {
                      setSearchTerm('');
                      setEventType('all');
                      setTagFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Events Cards */}
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4 text-xl"><FaLaptopCode className="inline-block mr-2" /> No events found</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredEvents.map((event) => {
                    const isHackathon = event.event_type === 'hackathon';
                    return (
                      <motion.div 
                        key={event.id} 
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)" }}
                      >
                        <Card className="h-full bg-white dark:bg-slate-800 border-none overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-32"> {/* Ensure parent has height */}
                          <div
                            className="h-full w-full bg-cover bg-center" 
                            style={{
                              backgroundImage: `url(/workshop.jpg)`, // Correct path
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat', // Prevent tiling
                            }}
                          >
                            {/* Gradient overlay with explicit z-index */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                          </div>
                          {/* Badge with higher z-index */}
                          <Badge
                            className={`absolute top-3 right-3 z-20 ${
                              isHackathon ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'
                            }`}
                          >
                            {isHackathon ? 'Hackathon' : 'Workshop'}
                          </Badge>
                          {/* Date with higher z-index */}
                          <div className="absolute bottom-2 left-3 dark:text-white text-black font-medium z-20">
                            <div className="flex items-center text-sm">
                              <FaCalendarAlt className="mr-2" />
                              {isHackathon ? (
                                `${formatDate(event.start_date).split(',')[0]} - ${formatDate(event.end_date).split(',')[0]}`
                              ) : (
                                formatDate(event.start_date).split(',')[0]
                              )}
                            </div>
                          </div>
                          </div>
                          {/* <img src='/workshop.jpg' alt='workshop' /> */}
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl text-indigo-900 dark:text-indigo-300">{event.title}</CardTitle>
                                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">By</span> 
                                  <span className="ml-1 flex items-center">
                                    <Avatar className="h-4 w-4 mr-1">
                                      <AvatarImage src={event.organizer_logo || '/company-logo.png'} alt={event.organized_by_name} />
                                      <AvatarFallback>{event.organized_by_name.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                    {event.organized_by_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <CardDescription className={`${isHackathon ? 'line-clamp-2' : 'line-clamp-3'} mb-3`}>
                              {event.description}
                            </CardDescription>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {event.tags && event.tags.length > 0 ? (
                                event.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                                  Workshop
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <FaClock className="mr-2 text-indigo-500" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Time:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                  {isHackathon ? 'Multiple sessions' : `${formatTime(event.start_date)} - ${formatTime(event.end_date)}`}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Location:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">{event.location}</span>
                              </div>
                              {isHackathon && event.prizes && (
                                <div className="flex items-start text-sm">
                                  <FaTrophy className="mr-2 text-indigo-500 mt-1" />
                                  <div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Prizes:</span>
                                    <div className="ml-2 text-gray-600 dark:text-gray-400">
                                      {(() => {
                                        if (!event.prizes) return <div>No prizes information available</div>;
                                        
                                        if (typeof event.prizes === 'string') {
                                          // Try to parse as JSON if it looks like JSON
                                          if (event.prizes.startsWith('{') || event.prizes.startsWith('[')) {
                                            try {
                                              const prizesObj = JSON.parse(event.prizes);
                                              if (typeof prizesObj === 'object' && prizesObj !== null) {
                                                return Object.entries(prizesObj).map(([place, prize], index) => (
                                                  <div key={index}>
                                                    <span className="font-medium capitalize">{place}:</span> {prize}
                                                  </div>
                                                ));
                                              }
                                            } catch (e) {
                                              // If parsing fails, just display the string
                                              console.warn('Failed to parse prizes JSON:', e);
                                            }
                                          }
                                          // Display as regular string if not JSON or parsing failed
                                          return <div>{event.prizes}</div>;
                                        }
                                        
                                        // Handle case where prizes might be an object already
                                        if (typeof event.prizes === 'object' && event.prizes !== null) {
                                          return Object.entries(event.prizes).map(([place, prize], index) => (
                                            <div key={index}>
                                              <span className="font-medium capitalize">{place}:</span> {prize}
                                            </div>
                                          ));
                                        }
                                        
                                        // Fallback for any other type
                                        return <div>{String(event.prizes)}</div>;
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          
                          <CardFooter className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FaUsers className="mr-2 text-indigo-500" />
                              <span>
                                {event.max_participants} {event.max_participants === 1 ? 'spot' : 'spots'} 
                                {isHackathon && event.max_team_size && ` (teams of ${event.max_team_size})`}
                              </span>
                            </div>
                            <div className="flex">
                              <Link href={`/workshops/${event.id}`}>
                                <Button size="sm" variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
                                  {new Date(event.registration_deadline) > new Date() 
                                    ? 'Register Now' 
                                    : 'View Details'}
                                </Button>
                              </Link>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </section>
    </main>
  )
}
