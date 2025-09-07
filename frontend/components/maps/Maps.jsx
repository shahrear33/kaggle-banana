"use client"
import { useRef, useState } from "react"
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api"
import { Button } from "./ui/button"

const center = { lat :  23.7270478, lng : 90.4031032 }

export default function Maps({ setPlace }) { 
  const { isLoaded } = useLoadScript({
    googleMapsApiKey : process.env.NEXT_PUBLIC_MAP_API_KEY,
    libraries: ['places'],
    })

    const [map, setMap] = useState(null)
    const [location, setLocation] = useState("")
    const [marker, setMarker] = useState(center)
    const originRef = useRef()
    if (!isLoaded) {
        return <div><p className="skeleton-text">Loading...</p></div>
      }
const handleSelectClick = async () => {
    try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK' && results.length > 0) {
                resolve(results[0].geometry.location);
              } else {
                    reject(new Error('Location not found'));
                }
            })
        })
        center.lat = result.lat()
        center.lng = result.lng();
        setMarker({ lat: result.lat(), lng: result.lng() })
        map.panTo({ lat: result.lat(), lng: result.lng() });
        map.setZoom(15);
        
    } catch (error) {
        console.error('Error geocoding location:', error);
        alert('Error finding location. Please try again.');
    }
};

const handleMarkerDragEnd = (event) => {
    const newMarkerPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(newMarkerPosition);
  };
  function handleDone() {
    setPlace(marker)
  }

  return (
    <div className={`w-full flex items-center flex-col h-[28rem]`}>
        <div className="my-4 flex items-center justify-center w-full px-4 space-x-6 text-lg">
            <Autocomplete>
                <input type="text" name="name" placeholder="Enter Your Location" className="w-full border border-gray-200 bg-white rounded-md py-3 px-6 shadow-one outline-none focus:border-primary focus-visible:shadow-none" value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    ref={originRef}
                />
            </Autocomplete>
            <div className="flex space-x-4">
                <Button onClick={handleSelectClick} className="bg-[#2c7749] hover:bg-[#2c7749] text-lg">Select </Button>
                <Button onClick={handleDone} className="bg-[#156c86] hover:bg-[#156c86] text-lg">Done </Button>
            </div>
        </div>


       <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl : false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={marker}  draggable={true} onDragEnd={handleMarkerDragEnd} />
        </GoogleMap>
    </div>
  )
}
