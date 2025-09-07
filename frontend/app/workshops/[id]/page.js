"use client"

import { useState, useEffect, use } from 'react';
import { useLanguage } from '@/lib/language/LanguageContext';
import { Quicksand, Poppins, Lato } from 'next/font/google';
import { Toaster } from '@/components/ui/components/toaster';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/components/card';
import { Badge } from '@/components/ui/components/badge';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/components/tabs';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaLaptopCode, FaTrophy, FaChevronLeft, FaLink, FaFileAlt } from 'react-icons/fa';
import api from '@/axiosInstance';
import { events as mockEvents } from '@/lib/mock';

const poppins = Lato({ subsets: ['latin'], weight: '700' });
const playfair = Quicksand({ subsets: ['latin'], weight: '400' });

export default function WorkshopDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const { t } = useLanguage();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Fetch workshop data
  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (!unwrappedParams?.id) return;
      
      setLoading(true);
      try {
        // Call the events API endpoint with the specific ID
        const response = await api.get(`/events/${unwrappedParams.id}`);
        
        // Check if we have valid data
        if (response?.data) {
          // Process API data and add fallbacks for null values
          const processedData = {
            id: response.data?.id ?? unwrappedParams.id,
            title: response.data?.title ?? 'Unnamed Workshop',
            description: response.data?.description ?? 'No description available',
            event_type: response.data?.event_type ?? 'workshop',
            start_date: response.data?.start_date ?? new Date().toISOString(),
            end_date: response.data?.end_date ?? new Date().toISOString(),
            registration_deadline: response.data?.registration_deadline ?? new Date().toISOString(),
            location: response.data?.location ?? 'Online',
            meeting_link: response.data?.meeting_link ?? '',
            max_participants: response.data?.max_participants ?? 0,
            max_team_size: response.data?.max_team_size ?? null,
            is_active: response.data?.is_active ?? true,
            prizes: response.data?.prizes ?? null,
            organized_by_name: response.data?.organized_by?.company_name ?? 'Unknown Organizer',
            organized_by_id: response.data?.organized_by?.id ?? 0,
            tags: response.data?.required_skills ?? [],
            materials: response.data?.materials ?? [],
            participant_count: response.data?.participant_count ?? 0,
            cover_image_url: response.data?.cover_image_url ?? null
          };
          
          setWorkshop(processedData);
          console.log('Fetched workshop details from API:', processedData);
        } else {
          // Fallback to mock data if API returns invalid data
          console.warn('Invalid data format from API, using mock data instead');
          const mockWorkshop = mockEvents.find(event => event.id.toString() === unwrappedParams.id.toString());
          if (mockWorkshop) {
            setWorkshop(mockWorkshop);
          } else {
            throw new Error('Workshop not found');
          }
        }
      } catch (err) {
        console.error('Error fetching workshop details:', err);
        setError(err.message);
        
        // Try to find in mock data as fallback
        const mockWorkshop = mockEvents.find(event => event.id.toString() === unwrappedParams.id.toString());
        if (mockWorkshop) {
          setWorkshop(mockWorkshop);
        } else {
          toast({
            title: "Error",
            description: "Workshop not found. Please try again later.",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshopDetails();
  }, [params?.id, toast]);

  // Handle registration
  const handleRegister = () => {
    toast({
      title: "Registration Submitted",
      description: "Your registration for this workshop has been submitted successfully.",
      variant: "success"
    });
  };

  // Check if registration is still open
  const isRegistrationOpen = workshop && new Date(workshop.registration_deadline) > new Date();

  // Check if workshop is a hackathon
  const isHackathon = workshop?.event_type === 'hackathon';

  if (loading) {
    return (
      <main className={`${playfair.className} mt-4 w-full overflow-hidden scrollbar-hidden min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800`}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading workshop details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !workshop) {
    return (
      <main className={`${playfair.className} mt-4 w-full overflow-hidden scrollbar-hidden min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800`}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="text-red-500 mb-4 text-xl"><FaLaptopCode className="inline-block mr-2" /> Error loading workshop</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`${playfair.className} mt-4 w-full overflow-hidden scrollbar-hidden min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800`}>
      <Toaster />
      <section className='h-full w-[90%] mx-auto p-8 bg-white dark:bg-slate-900 rounded-xl shadow-xl'>
        {/* Back button */}
        <Link href="/workshops" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6">
          <FaChevronLeft className="mr-2" /> Back to Workshops
        </Link>
        
        {workshop && (
          <>
            {/* Hero section */}
            <div className="relative rounded-xl overflow-hidden mb-8">
              <div 
                className="h-64 w-full bg-cover bg-center" 
                style={{ 
                  backgroundImage: `url(${workshop.cover_image_url || '/events/default-event.jpg'})`,
                  backgroundPosition: 'center' 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 dark:text-white text-black">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge 
                    className={`mb-3 ${isHackathon ? 'bg-purple-600' : 'bg-indigo-600'}`}
                  >
                    {isHackathon ? 'Hackathon' : 'Workshop'}
                  </Badge>
                  
                  <h1 className={`${poppins.className} text-3xl md:text-4xl font-bold mb-2`}>
                    {workshop.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {isHackathon 
                        ? `${formatDate(workshop.start_date)} - ${formatDate(workshop.end_date)}`
                        : formatDate(workshop.start_date)
                      }
                    </div>
                    
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      {isHackathon 
                        ? 'Multiple sessions'
                        : `${formatTime(workshop.start_date)} - ${formatTime(workshop.end_date)}`
                      }
                    </div>
                    
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      {workshop.location}
                    </div>
                    
                    <div className="flex items-center">
                      <FaUsers className="mr-2" />
                      {workshop.max_participants} {workshop.max_participants === 1 ? 'spot' : 'spots'}
                      {isHackathon && workshop.max_team_size && ` (teams of ${workshop.max_team_size})`}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3">
                    <span className="font-medium mr-2">Organized by:</span>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={workshop.organizer_logo || '/company-logo.png'} alt={workshop.organized_by_name} />
                        <AvatarFallback>{workshop.organized_by_name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      {workshop.organized_by_name}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Registration status and button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div>
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-300">Registration {isRegistrationOpen ? 'Open' : 'Closed'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRegistrationOpen 
                    ? `Register before ${formatDate(workshop.registration_deadline)}` 
                    : 'Registration deadline has passed'}
                </p>
              </div>
              
              <Button 
                className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                disabled={!isRegistrationOpen}
                onClick={handleRegister}
              >
                {isRegistrationOpen ? 'Register Now' : 'Registration Closed'}
              </Button>
            </div>
            
            {/* Content tabs */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-3 w-full sm:w-[400px] bg-indigo-100 dark:bg-indigo-900/30">
                <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="materials" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Materials</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workshop Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{workshop.description}</p>
                    </div>
                    
                    {workshop.tags && workshop.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {workshop.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {isHackathon && workshop.prizes && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Prizes</h3>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                          {(() => {
                            if (!workshop.prizes) return <div>No prizes information available</div>;
                            
                            if (typeof workshop.prizes === 'string') {
                              // Try to parse as JSON if it looks like JSON
                              if (workshop.prizes.startsWith('{') || workshop.prizes.startsWith('[')) {
                                try {
                                  const prizesObj = JSON.parse(workshop.prizes);
                                  if (typeof prizesObj === 'object' && prizesObj !== null) {
                                    return Object.entries(prizesObj).map(([place, prize], index) => (
                                      <div key={index} className="flex items-center mb-2 last:mb-0">
                                        <FaTrophy className="mr-2 text-indigo-500" />
                                        <span className="font-medium capitalize">{place}:</span>
                                        <span className="ml-2">{prize}</span>
                                      </div>
                                    ));
                                  }
                                } catch (e) {
                                  // If parsing fails, just display the string
                                  console.warn('Failed to parse prizes JSON:', e);
                                }
                              }
                              // Display as regular string if not JSON or parsing failed
                              return <div>{workshop.prizes}</div>;
                            }
                            
                            // Handle case where prizes might be an object already
                            if (typeof workshop.prizes === 'object' && workshop.prizes !== null) {
                              return Object.entries(workshop.prizes).map(([place, prize], index) => (
                                <div key={index} className="flex items-center mb-2 last:mb-0">
                                  <FaTrophy className="mr-2 text-indigo-500" />
                                  <span className="font-medium capitalize">{place}:</span>
                                  <span className="ml-2">{prize}</span>
                                </div>
                              ));
                            }
                            
                            // Fallback for any other type
                            return <div>{String(workshop.prizes)}</div>;
                          })()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="materials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workshop Materials</CardTitle>
                    <CardDescription>Resources provided for this workshop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {workshop.materials && workshop.materials.length > 0 ? (
                      <div className="space-y-4">
                        {workshop.materials.map((material, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                                <FaFileAlt className="text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-lg">{material.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{material.description}</p>
                                {material.file_url && (
                                  <a 
                                    href={`${process.env.NEXT_PUBLIC_ENDPOINT}/${material.file_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2 text-sm"
                                  >
                                    Download Material <FaLink className="ml-1" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FaFileAlt className="mx-auto h-12 w-12 mb-4 text-gray-300 dark:text-gray-600" />
                        <p>No materials have been provided for this workshop yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Event Information</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <FaCalendarAlt className="mr-2 text-indigo-500 mt-1" />
                            <div>
                              <span className="font-medium">Date:</span>
                              <div className="text-gray-600 dark:text-gray-400">
                                {isHackathon 
                                  ? `${formatDate(workshop.start_date)} - ${formatDate(workshop.end_date)}`
                                  : formatDate(workshop.start_date)
                                }
                              </div>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <FaClock className="mr-2 text-indigo-500 mt-1" />
                            <div>
                              <span className="font-medium">Time:</span>
                              <div className="text-gray-600 dark:text-gray-400">
                                {isHackathon 
                                  ? 'Multiple sessions (see description for schedule)'
                                  : `${formatTime(workshop.start_date)} - ${formatTime(workshop.end_date)}`
                                }
                              </div>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <FaMapMarkerAlt className="mr-2 text-indigo-500 mt-1" />
                            <div>
                              <span className="font-medium">Location:</span>
                              <div className="text-gray-600 dark:text-gray-400">{workshop.location}</div>
                            </div>
                          </li>
                          {workshop.meeting_link && (
                            <li className="flex items-start">
                              <FaLink className="mr-2 text-indigo-500 mt-1" />
                              <div>
                                <span className="font-medium">Meeting Link:</span>
                                <div>
                                  <a 
                                    href={workshop.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                  >
                                    {workshop.meeting_link}
                                  </a>
                                </div>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Participation Details</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <FaUsers className="mr-2 text-indigo-500 mt-1" />
                            <div>
                              <span className="font-medium">Capacity:</span>
                              <div className="text-gray-600 dark:text-gray-400">
                                {workshop.max_participants} {workshop.max_participants === 1 ? 'participant' : 'participants'}
                              </div>
                            </div>
                          </li>
                          {isHackathon && workshop.max_team_size && (
                            <li className="flex items-start">
                              <FaUsers className="mr-2 text-indigo-500 mt-1" />
                              <div>
                                <span className="font-medium">Team Size:</span>
                                <div className="text-gray-600 dark:text-gray-400">
                                  Up to {workshop.max_team_size} members per team
                                </div>
                              </div>
                            </li>
                          )}
                          <li className="flex items-start">
                            <FaCalendarAlt className="mr-2 text-indigo-500 mt-1" />
                            <div>
                              <span className="font-medium">Registration Deadline:</span>
                              <div className="text-gray-600 dark:text-gray-400">
                                {formatDate(workshop.registration_deadline)}
                              </div>
                            </div>
                          </li>
                          {workshop.participant_count !== null && (
                            <li className="flex items-start">
                              <FaUsers className="mr-2 text-indigo-500 mt-1" />
                              <div>
                                <span className="font-medium">Current Participants:</span>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {workshop.participant_count} registered
                                </div>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </section>
    </main>
  );
}
