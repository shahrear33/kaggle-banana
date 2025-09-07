"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/components/button";
import { Input } from "@/components/ui/components/input";
import { Textarea } from "@/components/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/components/toaster";
import Image from "next/image";
import { FiDownload, FiShare2, FiArrowLeft, FiUpload, FiDollarSign } from "react-icons/fi";
import { MdOutlineDesignServices, MdAttachMoney } from "react-icons/md";
import Hero from "@/components/utils/Hero";
import ThreeDViewer from "@/components/3d/ThreeDViewer";
import SimpleImageViewer from "@/components/3d/SimpleImageViewer";
import Working3DViewer from "@/components/3d/Working3DViewer";
import Real3DViewer from "@/components/3d/Real3DViewer";
import Interactive3DViewer from "@/components/3d/Interactive3DViewer";
import Real3DBuildingViewer from "@/components/3d/Real3DBuildingViewer";
import New3DBuildingViewer from "@/components/3d/New3DBuildingViewer";

export default function FloorPlan3DWithCost() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [usedPrompt, setUsedPrompt] = useState("");
  const [costEstimation, setCostEstimation] = useState(null);
  const [country, setCountry] = useState("United States");
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomInteriorImage, setRoomInteriorImage] = useState(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [designStyle, setDesignStyle] = useState("Modern");
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [useSimpleViewer, setUseSimpleViewer] = useState(true); // Start with simple viewer
  const router = useRouter();
  const { toast } = useToast();

  // List of countries for selection
  const countries = [
    "United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands",
    "Sweden", "Norway", "Denmark", "Australia", "New Zealand", "Japan", "South Korea", "Singapore",
    "India", "China", "Brazil", "Mexico", "Argentina", "South Africa", "UAE", "Saudi Arabia",
    "Bangladesh", "Pakistan", "Indonesia", "Thailand", "Malaysia", "Philippines"
  ];

  // Design styles for room interior generation
  const designStyles = [
    "Modern", "Contemporary", "Minimalist", "Scandinavian", "Industrial", "Bohemian", 
    "Traditional", "Rustic", "Mediterranean", "Art Deco", "Mid-Century Modern", "Farmhouse"
  ];

  // Function to handle 3D generation with cost estimation
  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "Please upload a floor plan image first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      // Make prompt optional - use a default if empty
      const finalPrompt = prompt.trim() || "Generate a modern 3D interior design from this floor plan";
      formData.append("prompt", finalPrompt);
      formData.append("country", country);
      
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/v1/generate-interior-3d-with-cost`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.image_url) {
        setGeneratedImage(data.image_url);
        setUsedPrompt(data.prompt);
        setCostEstimation(data.cost_estimation);
        
        // Automatically detect rooms from the generated 3D image
        await detectRoomsFrom3D(data.image_url);
        
        toast({
          title: "Success",
          description: "3D interior and cost estimation generated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.detail || data.message || "Failed to generate 3D interior",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to download the generated image
  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const imageUrl = generatedImage.startsWith('http') ? generatedImage : `${process.env.NEXT_PUBLIC_ENDPOINT}${generatedImage}`;
      const response = await fetch(imageUrl, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `floorplan-3d-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "3D interior image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      // Reset room selection state when new image is uploaded
      setRooms([]);
      setShowRoomSelection(false);
      setSelectedRoom(null);
      setRoomInteriorImage(null);
    }
  };

  // Function to detect rooms from the generated 3D image
  const detectRoomsFrom3D = async (imageUrl) => {
    if (!imageUrl) return;
    
    setLoading(true);
    try {
      // Convert image URL to blob for upload
      const response = await fetch(imageUrl, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append("image", blob, "3d-image.png");

      const detectResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/v1/detect-rooms-from-3d`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
        body: formData,
      });

      const data = await detectResponse.json();
      if (detectResponse.ok && data.rooms) {
        setRooms(data.rooms);
        setShowRoomSelection(true);
        toast({
          title: "Success",
          description: `Detected ${data.rooms.length} rooms in the 3D interior`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to detect rooms in the 3D interior",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error detecting rooms from 3D:', error);
      toast({
        title: "Error",
        description: "Failed to detect rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to generate interior for a specific room
  const generateRoomInterior = async (room) => {
    if (!room || !generatedImage) return;
    
    setRoomLoading(true);
    setSelectedRoom(room);
    try {
      // Convert generated image URL to blob for upload
      const response = await fetch(generatedImage, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append("room_type", room.type);
      formData.append("room_label", room.label);
      formData.append("design_style", designStyle);
      formData.append("country", country);
      formData.append("image", blob, "3d-image.png");

      const roomResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/v1/generate-room-interior`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
        body: formData,
      });

      const data = await roomResponse.json();
      if (roomResponse.ok && data.image_url) {
        setRoomInteriorImage(data.image_url);
        toast({
          title: "Success",
          description: `${room.label} interior generated successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: data.detail || "Failed to generate room interior",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating room interior:', error);
      toast({
        title: "Error",
        description: "Failed to generate room interior. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRoomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 font-sans">
      {/* Navigation */}
      <Hero />

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-rose-900 text-white py-20">
        <div className="relative max-w-6xl mx-auto px-4 text-center">
        <Button 
            onClick={() => router.back()} 
            variant="gradient" 
            className="mb-8 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Button>
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
            <MdOutlineDesignServices className="mr-2" />
            3D Floor Plan Visualization
          </div>
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight text-white mb-6">
            Create <span className="font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">3D Interior & Cost</span>
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed max-w-3xl mx-auto">
            Transform your 2D floor plans into stunning 3D interior visualizations with detailed cost estimation. Upload existing plans or describe your dream space.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Generation Interface */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 mb-16">
          <div className="flex items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-fuchsia-100 rounded-2xl mr-6">
              <MdOutlineDesignServices className="text-3xl text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">3D Interior & Cost Estimation</h2>
              <p className="text-gray-600">Generate 3D visualizations from floor plans and get detailed renovation costs</p>
            </div>
          </div>

          {/* Country and Design Style Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
              >
                {countries.map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Design Style</label>
              <select
                value={designStyle}
                onChange={(e) => setDesignStyle(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
              >
                {designStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-fuchsia-50 rounded-2xl p-8">
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Floor Plan</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {uploadedImage && (
                  <p className="text-sm text-emerald-600 mt-2">✓ Floor plan uploaded: {uploadedImage.name}</p>
                )}
              </div>

              {/* Text Description Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Design Description (Optional)
                  <span className="text-gray-500 text-sm font-normal ml-2">- Leave empty to use default modern style</span>
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Optional: Add specific design preferences... (e.g., 'Modern style with wood floors, large windows, open kitchen concept')"
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !uploadedImage}
                className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Generating 3D Interior & Cost..." : "Generate 3D Interior & Cost Estimation"}
              </Button>
            </div>
          </div>

          {/* Floor Plan Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-3">Floor Plan Types</h4>
              <p className="text-indigo-700 text-sm">Apartment, house, office, studio, loft, commercial space</p>
            </div>
            <div className="bg-fuchsia-50 p-6 rounded-xl border border-fuchsia-100">
              <h4 className="font-semibold text-fuchsia-900 mb-3">Room Layout</h4>
              <p className="text-fuchsia-700 text-sm">Open floor, separate rooms, kitchen layout, bathroom placement</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h4 className="font-semibold text-emerald-900 mb-3">Design Elements</h4>
              <p className="text-emerald-700 text-sm">Furniture style, flooring, lighting, windows, color scheme</p>
            </div>
          </div>
        </div>

        {/* Room Selection Interface - Only show after 3D generation */}
        {showRoomSelection && rooms.length > 0 && generatedImage && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 mb-16">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-fuchsia-100 to-rose-100 rounded-2xl mr-6">
                <MdOutlineDesignServices className="text-3xl text-fuchsia-600" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Interactive Room Design</h2>
                <p className="text-gray-600">Hover over the 3D interior to highlight rooms, then click to generate specific room designs</p>
              </div>
            </div>

            {/* 3D Viewer with Room Detection */}
            {generatedImage && (
              <div className="relative mb-8">
                {/* Viewer Toggle */}
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setUseSimpleViewer(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        useSimpleViewer 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Simple View
                    </button>
                    <button
                      onClick={() => setUseSimpleViewer(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        !useSimpleViewer 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      3D View
                    </button>
                  </div>
                </div>

                {/* Viewer Component */}
                {useSimpleViewer ? (
                  <SimpleImageViewer
                    imageUrl={generatedImage}
                    rooms={rooms}
                    onRoomClick={generateRoomInterior}
                    selectedRoom={selectedRoom}
                  />
                ) : (
                  <New3DBuildingViewer
                    imageUrl={generatedImage}
                    rooms={rooms}
                  />
                )}
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  {useSimpleViewer 
                    ? 'Hover over areas to see room highlights, then click to generate interior designs'
                    : 'Drag to orbit • Scroll to zoom • Right-click to pan • Explore the real 3D building'
                  }
                </p>
              </div>
            )}

            {/* Room List - Only show in simple view */}
            {useSimpleViewer && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Or select from room list:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room, index) => (
                    <div
                      key={room.id}
                      onClick={() => generateRoomInterior(room)}
                      className="bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-4 rounded-xl border border-indigo-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-indigo-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{room.label}</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          {room.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Confidence: {Math.round(room.confidence * 100)}%
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white"
                        disabled={roomLoading && selectedRoom?.id === room.id}
                      >
                        {roomLoading && selectedRoom?.id === room.id ? "Generating..." : "Generate Interior"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Room Interior Display */}
        {roomInteriorImage && selectedRoom && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-fuchsia-100 rounded-2xl mr-6">
                  <MdOutlineDesignServices className="text-3xl text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">{selectedRoom.label} Interior</h2>
                  <p className="text-gray-600">{designStyle} style design for {selectedRoom.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = roomInteriorImage;
                    link.download = `${selectedRoom.label}-interior-${Date.now()}.png`;
                    link.click();
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-fuchsia-600 hover:from-emerald-700 hover:to-fuchsia-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiDownload className="mr-2" /> Download
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                >
                  <FiShare2 className="mr-2" /> Share
                </Button>
              </div>
            </div>
            
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
              <Image 
                src={roomInteriorImage}
                alt={`${selectedRoom.label} Interior`} 
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-2xl"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Generated Image and Cost Display */}
        {generatedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generated Image */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex flex-col justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your 3D Interior</h3>
                  <p className="text-gray-600">Photorealistic 3D visualization</p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={downloadImage}
                    className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FiDownload className="mr-2" /> Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                  >
                    <FiShare2 className="mr-2" /> Share
                  </Button>
                </div>
              </div>
              
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <Image 
                  src={generatedImage}
                  alt="Generated 3D Interior" 
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-2xl"
                  unoptimized
                />
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-4 rounded-2xl border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <MdOutlineDesignServices className="text-xl text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Design Prompt:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded-xl border border-indigo-200 shadow-sm">
                      {usedPrompt || "No prompt available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Estimation */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl mr-4">
                  <MdAttachMoney className="text-2xl text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Cost Estimation</h3>
                  <p className="text-gray-600">Renovation costs for {country}</p>
                </div>
              </div>

              {costEstimation ? (
                <div className="space-y-6">
                  {/* Total Cost */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Total Estimated Cost</h4>
                        <p className="text-sm text-gray-600">Complete renovation budget</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-700">{costEstimation.total_cost}</p>
                        <p className="text-sm text-gray-500">{costEstimation.currency}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  {costEstimation.breakdown && costEstimation.breakdown.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                      <div className="space-y-3">
                        {costEstimation.breakdown.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">{item.category}</h5>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-semibold text-gray-900">{item.cost}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Items */}
                  {costEstimation.items && costEstimation.items.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h4>
                      <div className="space-y-2">
                        {costEstimation.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{item.item}</span>
                              {item.quantity && <span className="text-gray-500 text-sm ml-2">({item.quantity})</span>}
                            </div>
                            <span className="font-semibold text-gray-900">{item.cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Response Fallback */}
                  {costEstimation.raw_response && (!costEstimation.breakdown || costEstimation.breakdown.length === 0) && (
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Cost Analysis</h4>
                      <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">{costEstimation.raw_response}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiDollarSign className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500">Cost estimation will appear here after generating your 3D interior</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
}
