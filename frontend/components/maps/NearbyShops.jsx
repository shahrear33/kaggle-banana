"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/components/button"
import { motion } from "framer-motion"
import { FiMapPin, FiShoppingBag, FiNavigation, FiPhone, FiClock, FiStar } from "react-icons/fi"

// Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY


// Mock renovation shops data - Realistic US addresses and shop chains
const mockRenovationShops = [
  { 
    id: 1, 
    name: "Home Depot", 
    latitude: 40.7589, 
    longitude: -73.9851, 
    category: "Hardware & Tools",
    description: "Complete home improvement store with tools, materials, and expert advice",
    rating: 4.5,
    distance: "0.8 km",
    phone: "+1 (212) 555-0123",
    hours: "Mon-Sun: 6AM-10PM",
    address: "1234 Broadway, New York, NY 10001",
    items: ["Paint", "Flooring", "Hardware", "Tools", "Lighting"]
  },
  { 
    id: 2, 
    name: "Lowe's", 
    latitude: 40.7505, 
    longitude: -73.9934, 
    category: "Building Materials",
    description: "Building supplies, appliances, and home improvement products",
    rating: 4.3,
    distance: "1.2 km",
    phone: "+1 (212) 555-0234",
    hours: "Mon-Sun: 6AM-9PM",
    address: "456 6th Ave, New York, NY 10011",
    items: ["Appliances", "Flooring", "Cabinets", "Countertops", "Paint"]
  },
  { 
    id: 3, 
    name: "IKEA", 
    latitude: 40.7614, 
    longitude: -73.9776, 
    category: "Furniture & Decor",
    description: "Modern furniture, home accessories, and interior design solutions",
    rating: 4.2,
    distance: "2.1 km",
    phone: "+1 (212) 555-0345",
    hours: "Mon-Sun: 10AM-9PM",
    address: "789 3rd Ave, New York, NY 10017",
    items: ["Furniture", "Storage", "Lighting", "Decor", "Kitchen"]
  },
  { 
    id: 4, 
    name: "Sherwin Williams", 
    latitude: 40.7282, 
    longitude: -74.0776, 
    category: "Paint & Coatings",
    description: "Professional paint, stains, and coating solutions",
    rating: 4.6,
    distance: "1.8 km",
    phone: "+1 (212) 555-0456",
    hours: "Mon-Fri: 7AM-6PM, Sat: 8AM-5PM",
    address: "321 Hudson St, New York, NY 10013",
    items: ["Paint", "Stains", "Primers", "Brushes", "Rollers"]
  },
  { 
    id: 5, 
    name: "Floor & Decor", 
    latitude: 40.7505, 
    longitude: -73.9934, 
    category: "Flooring Specialists",
    description: "Hardwood, tile, carpet, and specialty flooring solutions",
    rating: 4.4,
    distance: "2.5 km",
    phone: "+1 (212) 555-0567",
    hours: "Mon-Sun: 7AM-8PM",
    address: "654 8th Ave, New York, NY 10036",
    items: ["Hardwood", "Tile", "Carpet", "Vinyl", "Laminate"]
  },
  { 
    id: 6, 
    name: "West Elm", 
    latitude: 40.7282, 
    longitude: -74.0776, 
    category: "Furniture & Decor",
    description: "Modern furniture and home decor with contemporary design",
    rating: 4.0,
    distance: "1.3 km",
    phone: "+1 (212) 555-0890",
    hours: "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
    address: "258 Spring St, New York, NY 10012",
    items: ["Modern Furniture", "Decor", "Lighting", "Textiles", "Accessories"]
  },
  { 
    id: 7, 
    name: "Pottery Barn", 
    latitude: 40.7505, 
    longitude: -73.9934, 
    category: "Furniture & Decor",
    description: "Classic and contemporary home furnishings and decor",
    rating: 4.3,
    distance: "1.7 km",
    phone: "+1 (212) 555-0901",
    hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-7PM",
    address: "369 Lexington Ave, New York, NY 10017",
    items: ["Furniture", "Bedding", "Decor", "Lighting", "Rugs"]
  },
  { 
    id: 8, 
    name: "Bed Bath & Beyond", 
    latitude: 40.7614, 
    longitude: -73.9776, 
    category: "Home Goods",
    description: "Home goods, bedding, and household essentials",
    rating: 4.1,
    distance: "2.3 km",
    phone: "+1 (212) 555-1012",
    hours: "Mon-Sun: 9AM-9PM",
    address: "741 1st Ave, New York, NY 10016",
    items: ["Bedding", "Bath", "Kitchen", "Storage", "Decor"]
  }
]

export default function NearbyShops({ userLocation = null, onShopSelect = null }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const [map, setMap] = useState(null)
  const [popups, setPopups] = useState([])
  const [shops, setShops] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [apiLoading, setApiLoading] = useState(false)
  const mapContainerRef = useRef(null)

  // Categories for filtering
  const categories = ["All", "Hardware & Tools", "Building Materials", "Furniture & Decor", "Paint & Coatings", "Flooring Specialists"]

  // Default center - use user location if provided, otherwise use first shop location
  const mapCenter = userLocation 
    ? { latitude: userLocation.lat, longitude: userLocation.lng }
    : shops.length > 0 
      ? { latitude: shops[0].latitude, longitude: shops[0].longitude }
      : { latitude: 40.7589, longitude: -73.9851 } // New York fallback

  // Filter shops by category
  const filteredShops = selectedCategory === "All" 
    ? shops 
    : shops.filter(shop => shop.category === selectedCategory)

  // Fetch shops from backend API
  const fetchShops = async (latitude, longitude, category = null) => {
    setApiLoading(true);
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: '5000'
      });
      
      if (category && category !== "All") {
        params.append('category', category);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/shops/nearby?${params}`, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShops(data.shops || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching shops:', err);
      // Fallback to static data
      setShops(mockRenovationShops);
      setError("Using offline shop data. Real-time data unavailable.");
    } finally {
      setApiLoading(false);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (userLocation) {
        resolve(userLocation);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            // Default to New York coordinates
            resolve({ lat: 40.7589, lng: -73.9851 });
          }
        );
      } else {
        // Default to New York coordinates
        resolve({ lat: 40.7589, lng: -73.9851 });
      }
    });
  };

  // Fetch shops data when component mounts
  useEffect(() => {
    const loadShops = async () => {
      const location = await getUserLocation();
      await fetchShops(location.lat, location.lng, selectedCategory);
    };
    
    loadShops();
  }, []);

  // Refetch shops when category changes
  useEffect(() => {
    if (shops.length > 0) {
      const loadShops = async () => {
        const location = await getUserLocation();
        await fetchShops(location.lat, location.lng, selectedCategory);
      };
      
      loadShops();
    }
  }, [selectedCategory]);

  // Initialize Google Maps when component mounts
  useEffect(() => {
    if (mapContainerRef.current && !map && GOOGLE_MAPS_API_KEY) {
      setIsLoading(true);
      
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }
      
      // Check if script is already being loaded
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        // Wait for existing script to load
        const checkLoaded = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkLoaded);
            initializeMap();
          }
        }, 100);
        
        // Cleanup after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          if (!window.google || !window.google.maps) {
            setError("Google Maps failed to load. Using offline data.");
            setShops(mockRenovationShops);
            setIsLoading(false);
          }
        }, 10000);
        
        return () => clearInterval(checkLoaded);
      }
      
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        initializeMap();
      };
      
      script.onerror = () => {
        console.error("Error loading Google Maps script");
        setError("Error loading map. Using offline data.");
        setShops(mockRenovationShops);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    }
    
    function initializeMap() {
      if (mapContainerRef.current && !map && window.google && window.google.maps) {
        console.log("Initializing Google Maps");
        const newMap = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: mapCenter.latitude, lng: mapCenter.longitude },
          zoom: 13,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });
        
        setMap(newMap);
        setIsLoading(false);
        console.log("Google Maps initialized successfully");
      }
    }
  }, [mapCenter.latitude, mapCenter.longitude]);

  // Add markers when shops data changes
  useEffect(() => {
    if (map && shops.length > 0) {
      // Clear existing markers
      if (window.googleMapsMarkers) {
        window.googleMapsMarkers.forEach(marker => marker.setMap(null));
      }
      window.googleMapsMarkers = [];
      
      const shopsToShow = filteredShops.length > 0 ? filteredShops : shops;
      
      shopsToShow.forEach(shop => {
        // Create custom marker icon
        const markerIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#4f46e5" stroke="white" stroke-width="3"/>
              <path d="M12 16h16v8H12z" fill="white"/>
              <path d="M16 20h8v2h-8z" fill="#4f46e5"/>
              <path d="M18 18h4v2h-4z" fill="#4f46e5"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        };
        
        // Create marker
        const marker = new window.google.maps.Marker({
          position: { lat: shop.latitude, lng: shop.longitude },
          map: map,
          title: shop.name,
          icon: markerIcon
        });
        
        // Create info window content
        const infoWindowContent = `
          <div class="p-4 min-w-[250px]">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-lg text-gray-900">${shop.name}</h3>
              <div class="flex items-center text-yellow-500">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-sm font-medium">${shop.rating}</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-2">${shop.description}</p>
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>${shop.distance}</span>
            </div>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>${shop.hours}</span>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
              ${shop.items.slice(0, 3).map(item => 
                `<span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">${item}</span>`
              ).join('')}
            </div>
            <button 
              onclick="window.selectShop('${shop.id}')"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </button>
          </div>
        `;
        
        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent
        });
        
        // Add click listener to marker
        marker.addListener('click', () => {
          setSelectedShop(shop);
          infoWindow.open(map, marker);
          
          // Center map on marker
          map.panTo({ lat: shop.latitude, lng: shop.longitude });
          map.setZoom(16);
        });
        
        window.googleMapsMarkers.push(marker);
      });
    }
  }, [map, shops, filteredShops]);

  // Handle shop selection
  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    if (onShopSelect) {
      onShopSelect(shop);
    }
  };

  // Set up global function for info window buttons
  useEffect(() => {
    window.selectShop = (shopId) => {
      const shop = shops.find(s => s.id === shopId);
      if (shop) {
        handleShopSelect(shop);
      }
    };
    
    return () => {
      delete window.selectShop;
    };
  }, [shops]);

  // Handle reset view to see all markers
  const handleResetView = () => {
    if (map) {
      map.panTo({ lat: mapCenter.latitude, lng: mapCenter.longitude });
      map.setZoom(13);
      setSelectedShop(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nearby Renovation Shops</h2>
        <p className="text-gray-600">Find stores that sell the items you need for your renovation</p>
        {apiLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mr-2"></div>
            <span className="text-sm text-gray-600">Loading shops...</span>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex justify-start space-x-6 max-w-[70%]">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category 
                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
                : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-1'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="w-full h-[750px] relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            {/* Loading state */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-red-500 font-semibold">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-3 bg-indigo-600"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
            
            {/* Map container */}
            <motion.div 
              className="w-full h-full bg-gray-200 rounded-2xl overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div ref={mapContainerRef} className="w-full h-full" />
            </motion.div>
            
            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <Button 
                variant="icon"
                onClick={handleResetView}
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
                size="sm"
              >
                View All
              </Button>
            </div>
          </div>
        </div>

        {/* Shop List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Shops ({filteredShops.length})
          </h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {apiLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                <span className="text-gray-600">Loading shops...</span>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No shops found in this category.</p>
              </div>
            ) : (
              filteredShops.map(shop => (
              <motion.div
                key={shop.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedShop?.id === shop.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
                onClick={() => handleShopSelect(shop)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{shop.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{shop.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span>{shop.distance}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiClock className="w-4 h-4 mr-1" />
                  <span>{shop.hours}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {shop.items.slice(0, 4).map(item => (
                    <span key={item} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Shop Details */}
      {selectedShop && (
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedShop.name}</h3>
              <p className="text-gray-600">{selectedShop.category}</p>
            </div>
            <div className="flex items-center text-yellow-500">
              <FiStar className="w-5 h-5 mr-1" />
              <span className="text-lg font-semibold">{selectedShop.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{selectedShop.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FiMapPin className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{selectedShop.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiNavigation className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{selectedShop.distance} away</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiPhone className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{selectedShop.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiClock className="w-5 h-5 mr-2 text-indigo-600" />
              <span>{selectedShop.hours}</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Available Items:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedShop.items.map(item => (
                <span key={item} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => window.open(`https://maps.google.com/?q=${selectedShop.latitude},${selectedShop.longitude}`, '_blank')}
            >
              <FiNavigation className="mr-2" /> Get Directions
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(`tel:${selectedShop.phone}`)}
            >
              <FiPhone className="mr-2" /> Call Store
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

