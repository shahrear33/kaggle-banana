"use client";

import React, { useState, useEffect, use, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/components/card';
import { Input } from '@/components/ui/components/input';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/components/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/components/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/components/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language/LanguageContext';
import { companies } from '@/lib/mock';
import { HiOfficeBuilding, HiDotsVertical, HiSearch, HiTrash, HiCheck, HiX, HiPencil, HiExternalLink } from 'react-icons/hi';
import { BiFilterAlt } from 'react-icons/bi';

const CompanyListItem = React.memo(function CompanyListItem({ company, onDelete, onViewDetails }) {
  // Callback handlers to prevent recreating functions on every render
  const handleViewDetails = useCallback(() => {
    onViewDetails(company);
  }, [company, onViewDetails]);
  
  const handleDelete = useCallback(() => {
    onDelete(company);
  }, [company, onDelete]);
  
  const handleVisitWebsite = useCallback(() => {
    window.open(company.website, '_blank');
  }, [company.website]);
  
  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={company.logo} alt={company.company_name} />
            <AvatarFallback className="text-xs">{company.company_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{company.company_name}</div>
            <div className="text-xs text-gray-500">{company.location}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {company.industries.slice(0, 2).map((industry, i) => (
            <Badge key={i} variant="outline" className="text-xs whitespace-nowrap">
              {industry}
            </Badge>
          ))}
          {company.industries.length > 2 && (
            <Badge variant="outline" className="text-xs">+{company.industries.length - 2}</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{company.company_size}</TableCell>
      <TableCell>{company.founded_year}</TableCell>
      <TableCell>
        <Badge 
          variant={company.verification_status ? "success" : "destructive"}
          className={company.verification_status ? 
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}
        >
          {company.verification_status ? "Verified" : "Unverified"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="relative inline-block text-left">
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <HiDotsVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
          <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
            <div className="py-1">
              <button
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleViewDetails}
              >
                <HiExternalLink className="mr-2 h-4 w-4" /> View Details
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleVisitWebsite}
              >
                <HiExternalLink className="mr-2 h-4 w-4" /> Visit Website
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleDelete}
              >
                <HiTrash className="mr-2 h-4 w-4" /> Delete Company
              </button>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
})

function CompanyDetailModal({ company, isOpen, onClose }) {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Company Details</DialogTitle>
      </DialogHeader>
      
      {company && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={company.logo} alt={company.company_name} />
              <AvatarFallback className="text-lg">{company.company_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-xl font-bold">{company.company_name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{company.location}</span>
                <span>•</span>
                <span>Founded {company.founded_year}</span>
                <span>•</span>
                <span className="capitalize">{company.company_size}</span>
              </div>
            </div>
          </div>
          
          <Badge 
            variant={company.verification_status ? "success" : "destructive"}
            className={company.verification_status ? 
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}
          >
            {company.verification_status ? "Verified" : "Unverified"}
          </Badge>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p>{company.description}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Industries</h4>
            <div className="flex flex-wrap gap-1.5">
              {company.industries.map((industry, i) => (
                <Badge key={i} variant="outline">{industry}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Currently Hiring For</h4>
            <div className="flex flex-wrap gap-1.5">
              {company.hiring_for.map((position, i) => (
                <Badge key={i} variant="secondary">{position}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              {company.website} <HiExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      )}
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function DeleteCompanyModal({ company, isOpen, onClose, onConfirm }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {company?.company_name}? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      {company && (
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={company.logo} alt={company.company_name} />
            <AvatarFallback>{company.company_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{company.company_name}</div>
            <div className="text-sm text-gray-500">{company.location}</div>
          </div>
        </div>
      )}
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={() => onConfirm(company.id)}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function ManageCompanies({ params }) {
  // Properly unwrap params with use() to avoid the warning
  const unwrappedParams = use(params);
  const { id } = unwrappedParams || {};
  
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [mounted, setMounted] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // For pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Get unique industries for filter - derived from companyList to avoid stale data
  const industries = useMemo(() => {
    return [...new Set(companyList.flatMap(company => company.industries))];
  }, [companyList]);
  
  // Initialize companies data only once
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setCompanyList(companies);
      setIsLoading(false);
      setMounted(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter companies based on search query and filters
  useEffect(() => {
    if (companyList.length === 0) return;
    
    let results = [...companyList];
    
    // Filter by active tab (all vs verified vs unverified)
    if (activeTab === 'verified') {
      results = results.filter(company => company.verification_status);
    } else if (activeTab === 'unverified') {
      results = results.filter(company => !company.verification_status);
    }
    
    // Search query filter
    if (searchQuery) {
      results = results.filter(company => 
        company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Industry filter
    if (industryFilter !== 'all') {
      results = results.filter(company => 
        company.industries.some(industry => industry === industryFilter)
      );
    }
    
    // Size filter
    if (sizeFilter !== 'all') {
      results = results.filter(company => company.company_size === sizeFilter);
    }
    
    // Verification filter
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      results = results.filter(company => company.verification_status === isVerified);
    }
    
    setFilteredCompanies(results);
  }, [companyList, searchQuery, industryFilter, sizeFilter, verificationFilter, activeTab]);
  
  // Handle company deletion
  const handleDeleteCompany = (companyId) => {
    setCompanyList(prev => prev.filter(company => company.id !== companyId));
    setShowDeleteModal(false);
    setSelectedCompany(null);
    
    toast({
      title: "Company deleted",
      description: "The company has been removed from the platform.",
    });
  };
  
  // Display company details
  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowDetailModal(true);
  };
  
  // Prepare to delete a company
  const handlePrepareDelete = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setIndustryFilter('all');
    setSizeFilter('all');
    setVerificationFilter('all');
    setActiveTab('all');
  };
  
  // Paginate results
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  
  // Create a consistent loading component that matches on both server and client
  const loadingComponent = (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading companies...</p>
      </div>
    </div>
  );
  
  // Only animate after client-side hydration completes
  if (!mounted || isLoading) {
    return loadingComponent;
  }
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <HiOfficeBuilding className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">{t('Manage Companies')}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          View, approve, edit, and manage all registered companies on the platform.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Tabs for quick filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="all">
              All Companies 
              <Badge className="ml-2" variant="secondary">{companies.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified 
              <Badge className="ml-2" variant="secondary">
                {companies.filter(c => c.verification_status).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unverified">
              Unverified 
              <Badge className="ml-2" variant="secondary">
                {companies.filter(c => !c.verification_status).length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search and filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="shrink-0"
              onClick={resetFilters}
              disabled={searchQuery === '' && industryFilter === 'all' && sizeFilter === 'all' && verificationFilter === 'all' && activeTab === 'all'}
            >
              <BiFilterAlt className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </Card>
        
        {/* Company table */}
        <Card className="overflow-hidden">
          {filteredCompanies.length === 0 ? (
            <div className="p-8 text-center">
              <HiOfficeBuilding className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No companies found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || industryFilter !== 'all' || sizeFilter !== 'all' || verificationFilter !== 'all' ? 
                  "Try adjusting your filters to find what you're looking for." : 
                  "There are no companies registered on the platform yet."}
              </p>
              {(searchQuery || industryFilter !== 'all' || sizeFilter !== 'all' || verificationFilter !== 'all') && (
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industries</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Founded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCompanies.map((company) => (
                      <CompanyListItem 
                        key={company.id} 
                        company={company} 
                        onDelete={handlePrepareDelete}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filteredCompanies.length)} of {filteredCompanies.length}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>
      
      {/* Modals */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <CompanyDetailModal 
          company={selectedCompany} 
          isOpen={showDetailModal} 
          onClose={() => setShowDetailModal(false)} 
        />
      </Dialog>
      
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DeleteCompanyModal 
          company={selectedCompany} 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={handleDeleteCompany}
        />
      </Dialog>
    </div>
  );
}
