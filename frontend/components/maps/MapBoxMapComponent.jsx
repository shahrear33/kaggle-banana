"use client"
import { useEffect, useRef, useState } from "react"
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { Button } from "../ui/components/button"
import { motion } from "framer-motion"

// Use the public access token directly
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZmFoaW0tLS0zMyIsImEiOiJjbWFjbjZsNGUwNHkyMmpweDdwbGpmNDJuIn0.i9XLwiXIJm01e25MFqAYIg"

// Default center coordinates
const defaultCenter = { latitude: 23.7270478, longitude: 90.4031032 }

export default function MapBoxMapComponent({ setPlace }) {
    const [location, setLocation] = useState("")
    const [marker, setMarker] = useState(defaultCenter)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    // Initialize map when component mounts
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            // Dynamically import mapboxgl to avoid SSR issues
            import('mapbox-gl').then((mapboxgl) => {
                // Set access token
                mapboxgl.default.accessToken = MAPBOX_ACCESS_TOKEN;
                
                // Create a new map instance
                const map = new mapboxgl.default.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [defaultCenter.longitude, defaultCenter.latitude],
                    zoom: 15,
                });
                
                // Create a marker
                const marker = new mapboxgl.default.Marker({
                    color: "#2c7749",
                    draggable: true
                })
                    .setLngLat([defaultCenter.longitude, defaultCenter.latitude])
                    .addTo(map);
                
                // Add marker drag end event
                marker.on('dragend', () => {
                    const lngLat = marker.getLngLat();
                    setMarker({
                        latitude: lngLat.lat,
                        longitude: lngLat.lng
                    });
                });
                
                // Save the map and marker instance
                mapRef.current = map;
                markerRef.current = marker;
                
                // Clean up on unmount
                return () => map.remove();
            }).catch(error => {
                console.error("Error loading Mapbox GL:", error);
                setError("Error loading map. Please try again later.");
            });
        }
    }, []);
    
    // Function to handle location search
    const handleSelectClick = async () => {
        if (!location.trim()) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Use Mapbox Geocoding API
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            );
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                const [longitude, latitude] = data.features[0].center;
                
                if (mapRef.current && markerRef.current) {
                    // Update marker position
                    markerRef.current.setLngLat([longitude, latitude]);
                    
                    // Update state
                    setMarker({
                        latitude,
                        longitude
                    });
                    
                    // Fly to the location
                    mapRef.current.flyTo({
                        center: [longitude, latitude],
                        zoom: 15,
                        duration: 2000
                    });
                } else {
                    // If map isn't fully initialized yet, just update state
                    setMarker({
                        latitude,
                        longitude
                    });
                    
                    // Re-initialize the map with the new location
                    if (mapContainerRef.current) {
                        import('mapbox-gl').then((mapboxgl) => {
                            mapboxgl.default.accessToken = MAPBOX_ACCESS_TOKEN;
                            
                            const map = new mapboxgl.default.Map({
                                container: mapContainerRef.current,
                                style: 'mapbox://styles/mapbox/streets-v11',
                                center: [longitude, latitude],
                                zoom: 15,
                            });
                            
                            const marker = new mapboxgl.default.Marker({
                                color: "#2c7749",
                                draggable: true
                            })
                                .setLngLat([longitude, latitude])
                                .addTo(map);
                            
                            marker.on('dragend', () => {
                                const lngLat = marker.getLngLat();
                                setMarker({
                                    latitude: lngLat.lat,
                                    longitude: lngLat.lng
                                });
                            });
                            
                            mapRef.current = map;
                            markerRef.current = marker;
                        }).catch(error => {
                            console.error("Error loading Mapbox GL:", error);
                            setError("Error loading map. Please try again later.");
                        });
                    }
                }
            } else {
                setError("Location not found. Please try another search term.");
            }
        } catch (error) {
            console.error('Error geocoding location:', error);
            setError("Error finding location. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    // No need for handleMarkerDragEnd as it's now handled in the useEffect

    // Handle done button click - pass the location back to parent
    const handleDone = () => {
        // Convert to the format expected by the parent component
        const locationForParent = {
            lat: marker.latitude,
            lng: marker.longitude
        }
        setPlace(locationForParent)
    }

  return (
    <div className="w-full h-screen">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="my-8 flex flex-col md:flex-row items-center justify-center w-full px-4 md:px-16 space-y-4 md:space-y-0 md:space-x-6 text-lg"
        >
            <div className="w-full relative">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter Your Location" 
                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectClick()}
                />
                {error && (
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-red-500 text-sm mt-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
            <div className="flex space-x-4">
                <Button 
                    onClick={handleSelectClick} 
                    className="bg-[#2c7749] hover:bg-[#2c7749] text-lg min-w-20"
                    disabled={isLoading}
                >
                    {isLoading ? "Searching..." : "Select"}
                </Button>
                <Button 
                    onClick={handleDone} 
                    className="bg-[#156c86] hover:bg-[#156c86] text-lg min-w-20"
                >
                    Done
                </Button>
            </div>
        </motion.div>

        <motion.div 
            className="w-full h-[calc(100%-6rem)] bg-gray-200 rounded-lg overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div ref={mapContainerRef} className="w-full h-full" />
        </motion.div>
    </div>
  )
}
