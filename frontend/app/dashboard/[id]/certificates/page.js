"use client"
import { useState } from 'react'
import { Quicksand, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/components/tabs'
import { Button } from '@/components/ui/components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/components/card'
import { Toaster } from '@/components/ui/components/toaster'
import { Badge } from '@/components/ui/components/badge'
import { FaCertificate, FaDownload, FaEye, FaTrophy, FaGraduationCap, FaCode, FaCodeBranch } from 'react-icons/fa'
import Image from 'next/image'
import PDFGenerator from '@/components/pdf/PDFGenerator'
import { useLanguage } from '@/lib/language/LanguageContext'
import { useToast } from '@/hooks/use-toast'

const poppins = Lato({ subsets: ['latin'], weight: '700' })
const playfair = Quicksand({ subsets: ['latin'], weight: '400' })

// Mock certificate data
const mockCertificates = [
  {
    id: 1,
    title: "Full Stack Web Development",
    issuer: "TryShip",
    issueDate: "May 5, 2025",
    validUntil: "Lifetime",
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
    credentialID: "TRYSHIP-FSWD-25-1023",
    type: "course",
    image: "/certificate-templates/web-dev.png",
    description: "Completed the comprehensive full stack web development program with excellence, demonstrating proficiency in building modern web applications.",
  },
  {
    id: 2,
    title: "AI & Machine Learning Hackathon Winner",
    issuer: "TryShip",
    issueDate: "April 12, 2025",
    validUntil: "Lifetime",
    skills: ["Python", "TensorFlow", "Data Analysis", "Neural Networks"],
    credentialID: "TRYSHIP-HACK-25-0872",
    type: "achievement",
    image: "/certificate-templates/ai-ml.png",
    description: "First place winner in the AI & Machine Learning hackathon, creating an innovative solution for educational challenges.",
  },
  {
    id: 3,
    title: "Advanced Data Structures & Algorithms",
    issuer: "TryShip",
    issueDate: "March 21, 2025",
    validUntil: "Lifetime",
    skills: ["Algorithms", "Data Structures", "Problem Solving", "Optimization"],
    credentialID: "TRYSHIP-DSA-25-0591",
    type: "course",
    image: "/certificate-templates/dsa.png",
    description: "Successfully completed the advanced algorithms course, demonstrating exceptional problem-solving capabilities and algorithmic thinking.",
  },
  {
    id: 4,
    title: "Top Performer: Mobile App Development",
    issuer: "TryShip",
    issueDate: "February 15, 2025",
    validUntil: "Lifetime",
    skills: ["Flutter", "Dart", "Firebase", "UI/UX Design"],
    credentialID: "TRYSHIP-MAD-25-0349",
    type: "achievement",
    image: "/certificate-templates/mobile-dev.png",
    description: "Recognized for outstanding performance in mobile application development micro-tasks, achieving the highest score in your cohort.",
  },
]

// Function to create certificate PDF data for the PDF Document component
const createCertificateData = (certificate) => {
  return [{
    name: certificate.title,
    best_time_to_visit: certificate.issueDate,
    entry_fee: certificate.credentialID,
    description: certificate.description
  }]
}

// Certificate Card Component
function CertificateCard({ certificate, onView }) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant={certificate.type === 'course' ? 'default' : 'secondary'} className="mb-2">
              {certificate.type === 'course' ? 'Course' : 'Achievement'}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {certificate.issueDate}
            </span>
          </div>
          <CardTitle className="line-clamp-2 text-lg">{certificate.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            ID: {certificate.credentialID}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <div className="flex flex-wrap gap-1 mb-3">
            {certificate.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {certificate.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{certificate.skills.length - 3}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {certificate.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button onClick={onView} variant="primary" className="w-full">
            <FaEye className="mr-2" /> View Certificate
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function CertificatesPage() {
  const { toast } = useToast()
  const [activeCertificate, setActiveCertificate] = useState(null)
  const { t } = useLanguage()

  const openCertificatePreview = (certificate) => {
    setActiveCertificate(certificate)
    toast({
      title: "Certificate loaded",
      description: "You can now download or view your certificate",
      duration: 3000,
    })
  }

  return (
    <div className={`${playfair.className} p-6`}>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}>
            Your Certificates & Achievements
          </h1>
          <Button size="sm" variant="outline" className="gap-2">
            <FaCertificate className="text-primary" />
            View All
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full md:w-96 grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          {/* All Certificates */}
          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCertificates.map((certificate) => (
                <CertificateCard 
                  key={certificate.id} 
                  certificate={certificate}
                  onView={() => openCertificatePreview(certificate)}
                />
              ))}
            </div>
          </TabsContent>
          
          {/* Course Certificates */}
          <TabsContent value="courses" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCertificates
                .filter(cert => cert.type === 'course')
                .map((certificate) => (
                  <CertificateCard 
                    key={certificate.id} 
                    certificate={certificate} 
                    onView={() => openCertificatePreview(certificate)}
                  />
                ))}
            </div>
          </TabsContent>
          
          {/* Achievement Certificates */}
          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCertificates
                .filter(cert => cert.type === 'achievement')
                .map((certificate) => (
                  <CertificateCard 
                    key={certificate.id} 
                    certificate={certificate}
                    onView={() => openCertificatePreview(certificate)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Certificate Preview & Download Section */}
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Certificate Preview */}
              <div className="flex flex-col">
                <h2 className={`${poppins.className} text-xl font-bold mb-4 text-gray-900 dark:text-white`}>
                  Certificate Preview
                </h2>
                <div className="relative h-64 md:h-80 w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <FaCertificate className="text-6xl text-primary mx-auto mb-2" />
                      <h3 className="text-lg font-semibold">{activeCertificate.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Issued by TryShip on {activeCertificate.issueDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" variant="secondary" className="w-1/2 gap-2">
                    <FaEye />
                    View Full Size
                  </Button>
                  <PDFGenerator 
                    input={createCertificateData(activeCertificate)} 
                    fileName={`TryShip-${activeCertificate.type === 'course' ? 'Course' : 'Achievement'}-${activeCertificate.credentialID}`}
                  />
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4">
                <h2 className={`${poppins.className} text-xl font-bold mb-4 text-gray-900 dark:text-white`}>
                  Certificate Details
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FaGraduationCap className="text-primary text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold">Title</h3>
                        <p className="text-gray-600 dark:text-gray-300">{activeCertificate.title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FaTrophy className="text-primary text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold">Credential ID</h3>
                        <p className="text-gray-600 dark:text-gray-300">{activeCertificate.credentialID}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FaCodeBranch className="text-primary text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold">Skills</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {activeCertificate.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FaCode className="text-primary text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold">Description</h3>
                        <p className="text-gray-600 dark:text-gray-300">{activeCertificate.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
