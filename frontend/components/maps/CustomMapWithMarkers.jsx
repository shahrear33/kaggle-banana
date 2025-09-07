"use client"
import { useEffect, useRef, useState } from "react"
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Button } from "../ui/components/button"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language/LanguageContext"

// Use the public access token (from the reference file)
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZmFoaW0tLS0zMyIsImEiOiJjbWFjbjZsNGUwNHkyMmpweDdwbGpmNDJuIn0.i9XLwiXIJm01e25MFqAYIg"

// Mock location data
const mockLocations = [
  { id: 1, name: "Dhaka University", latitude: 23.7341, longitude: 90.3963, description: "Historic university campus" },
  { id: 2, name: "Lalbagh Fort", latitude: 23.7198, longitude: 90.3882, description: "17th-century Mughal fort" },
  { id: 3, name: "Ahsan Manzil", latitude: 23.7085, longitude: 90.4048, description: "Historical palace and museum" },
  { id: 4, name: "Hatirjheel", latitude: 23.7766, longitude: 90.4151, description: "Urban recreational area" },
  { id: 5, name: "National Parliament House", latitude: 23.7626, longitude: 90.3778, description: "National parliament of Bangladesh" }
]

export default function CustomMapWithMarkers({ locations = mockLocations }) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [map, setMap] = useState(null)
  const [popups, setPopups] = useState([])
  const mapContainerRef = useRef(null)

  // Map center - average of all location coordinates or default to Dhaka
  const mapCenter = locations.length > 0 
    ? {
        longitude: locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length,
        latitude: locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length
      }
    : { latitude: 23.7270478, longitude: 90.4031032 } // Dhaka

  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainerRef.current && !map) {
      setIsLoading(true);
      
      // Dynamically import mapboxgl to avoid SSR issues
      import('mapbox-gl').then((mapboxgl) => {
        // Set access token
        mapboxgl.default.accessToken = MAPBOX_ACCESS_TOKEN;
        
        // Create a new map instance
        const newMap = new mapboxgl.default.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [mapCenter.longitude, mapCenter.latitude],
          zoom: 12,
        });
        
        // Add navigation controls
        newMap.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
        
        // Wait for map to load
        newMap.on('load', () => {
          setMap(newMap);
          setIsLoading(false);
          
          // Add markers for each location
          const newPopups = locations.map(location => {
            // Create custom marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'custom-marker';
            markerEl.innerHTML = `<div class="marker-icon" style="background-color: #2c7749; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; cursor: pointer; border: 2px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">${location.id}</div>`;
            
            // Create popup for this marker
            const popup = new mapboxgl.default.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 25,
              className: 'custom-popup'
            }).setHTML(`
              <div class="p-3">
                <h3 class="font-bold text-md">${location.name}</h3>
                <p class="text-sm text-gray-600">${location.description}</p>
              </div>
            `);
            
            // Add marker to map
            const marker = new mapboxgl.default.Marker({
              element: markerEl,
              anchor: 'bottom'
            })
              .setLngLat([location.longitude, location.latitude])
              .addTo(newMap);
            
            // Show popup on hover
            markerEl.addEventListener('mouseenter', () => {
              marker.setPopup(popup);
              popup.addTo(newMap);
            });
            
            markerEl.addEventListener('mouseleave', () => {
              popup.remove();
            });
            
            // Click handler
            markerEl.addEventListener('click', () => {
              setSelectedMarker(location);
              newMap.flyTo({
                center: [location.longitude, location.latitude],
                zoom: 15,
                duration: 1500
              });
            });
            
            return { marker, popup };
          });
          
          setPopups(newPopups);
        });
        
        // Clean up on unmount
        return () => {
          newMap.remove();
          setMap(null);
        };
      }).catch(error => {
        console.error("Error loading Mapbox GL:", error);
        setError("Error loading map. Please try again later.");
        setIsLoading(false);
      });
    }
  }, [locations]);

  // Handle reset view to see all markers
  const handleResetView = () => {
    if (map) {
      map.flyTo({
        center: [mapCenter.longitude, mapCenter.latitude],
        zoom: 12,
        duration: 1500
      });
      setSelectedMarker(null);
    }
  };

  return (
    <div className="w-full h-[600px] relative">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-red-500 font-semibold">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-3 bg-primary"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <motion.div 
        className="w-full h-full bg-gray-200 rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div ref={mapContainerRef} className="w-full h-full" />
      </motion.div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button 
          onClick={handleResetView}
          className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
          size="sm"
        >
          {t('viewAll') || 'View All'}
        </Button>
      </div>
      
      {/* Selected marker info */}
      {selectedMarker && (
        <motion.div 
          className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-bold text-lg">{selectedMarker.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{selectedMarker.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Lat: {selectedMarker.latitude.toFixed(4)}</p>
            <p>Lng: {selectedMarker.longitude.toFixed(4)}</p>
          </div>
          <Button
            className="mt-3 bg-primary w-full"
            size="sm"
            onClick={() => {
              // Example action with the selected marker
              console.log(`Selected: ${selectedMarker.name}`);
              // Here you could trigger navigation, open details, etc.
            }}
          >
            {t('viewDetails') || 'View Details'}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
