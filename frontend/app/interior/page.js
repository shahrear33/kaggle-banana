"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/components/button";
import { Input } from "@/components/ui/components/input";
import { Textarea } from "@/components/ui/components/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/components/dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/components/toaster";
import Image from "next/image";
import { FiDownload, FiShare2, FiArrowLeft, FiUpload, FiDollarSign, FiZoomIn, FiX, FiInfo } from "react-icons/fi";
import { MdOutlineDesignServices, MdAttachMoney, MdCompare } from "react-icons/md";
import Hero from "@/components/utils/Hero";
import NearbyShops from "@/components/maps/NearbyShops";

export default function Interior() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [usedPrompt, setUsedPrompt] = useState("");
  const [costEstimation, setCostEstimation] = useState(null);
  const [activeTab, setActiveTab] = useState("describe"); // "describe" or "upload"
  const [country, setCountry] = useState("United States");
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPromptTemplates, setShowPromptTemplates] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Interior renovation prompt templates
  const promptTemplates = [
    {
      category: "Living Room",
      prompts: [
        "Modern minimalist living room with white sofa, wooden coffee table, and large plants",
        "Cozy traditional living room with leather furniture, warm lighting, and bookshelves",
        "Scandinavian style living room with light wood, neutral colors, and natural textures",
        "Industrial living room with exposed brick, metal accents, and vintage furniture"
      ]
    },
    {
      category: "Bedroom",
      prompts: [
        "Master bedroom with king bed, walk-in closet, and en-suite bathroom",
        "Bohemian bedroom with colorful textiles, plants, and eclectic decor",
        "Modern bedroom with platform bed, built-in storage, and smart lighting",
        "Rustic bedroom with wooden beams, stone fireplace, and cozy textiles"
      ]
    },
    {
      category: "Kitchen",
      prompts: [
        "Open concept kitchen with island, stainless steel appliances, and quartz countertops",
        "Farmhouse kitchen with shaker cabinets, apron sink, and subway tile backsplash",
        "Modern kitchen with flat-panel cabinets, waterfall island, and smart appliances",
        "Traditional kitchen with raised panel cabinets, granite countertops, and pendant lighting"
      ]
    },
    {
      category: "Bathroom",
      prompts: [
        "Spa-like bathroom with freestanding tub, walk-in shower, and natural stone",
        "Modern bathroom with floating vanity, large mirror, and LED lighting",
        "Vintage bathroom with clawfoot tub, subway tiles, and brass fixtures",
        "Luxury bathroom with double vanity, rain shower, and heated floors"
      ]
    },
    {
      category: "Home Office",
      prompts: [
        "Productive home office with standing desk, ergonomic chair, and natural light",
        "Creative studio with large desk, inspiration board, and storage solutions",
        "Minimalist office with clean lines, hidden storage, and calming colors",
        "Industrial office with exposed brick, metal furniture, and vintage lighting"
      ]
    }
  ];

  // List of countries for selection
  const countries = [
    "United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands",
    "Sweden", "Norway", "Denmark", "Australia", "New Zealand", "Japan", "South Korea", "Singapore",
    "India", "China", "Brazil", "Mexico", "Argentina", "South Africa", "UAE", "Saudi Arabia",
    "Bangladesh", "Pakistan", "Indonesia", "Thailand", "Malaysia", "Philippines"
  ];

  // Function to handle interior generation with cost estimation
  const handleGenerateInterior = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a design description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("country", country);
      
      if (activeTab === "upload" && uploadedImage) {
        formData.append("image", uploadedImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/v1/generate-interior-with-cost`, {
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
        
        // Auto scroll to top to show the generated images
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        toast({
          title: "Success",
          description: "Interior design and cost estimation generated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.detail || data.message || "Failed to generate interior design",
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
      link.download = `interior-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Interior design image downloaded successfully",
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
    }
  };

  // Function to open image in modal
  const openImageModal = (imageUrl, imageType = "generated") => {
    setModalImage({ url: imageUrl, type: imageType });
    setModalOpen(true);
  };

  // Function to close modal
  const closeImageModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  // Function to copy prompt template
  const copyPromptTemplate = (template) => {
    setPrompt(template);
    setShowPromptTemplates(false);
    toast({
      title: "Template Applied",
      description: "Prompt template has been added to your input",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-rose-100 font-sans">
      {/* Navigation */}
      <Hero />

      {/* Header Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-rose-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Button 
            onClick={() => router.back()} 
            variant="gradient" 
            className="mb-8 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Button>
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
            <MdOutlineDesignServices className="mr-2" />
            Interior Design Visualization
          </div>
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight text-white mb-6">
            Transform Your <span className="font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Interior Space</span>
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed max-w-3xl mx-auto">
            Redesign your living spaces with AI-powered interior visualization. Create new designs from descriptions or transform existing rooms with uploaded photos.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[80%] mx-auto px-6 py-12" style={{ maxWidth: '1920px', width: '100%' }}>
        {/* Results Section - Show after generation */}
        {generatedImage && (
          <div className="mb-16">
            {/* Main Results Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mb-8">
              
                {/* Left Column - Images */}
                <div className="xl:col-span-2">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 h-fit">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-fuchsia-100 rounded-xl mr-4">
                        <MdCompare className="text-2xl text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Before & After</h2>
                        <p className="text-gray-600">AI-powered design transformation</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={downloadImage}
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white px-3 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FiDownload className="mr-1" /> Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 px-3 py-2 rounded-lg font-semibold transition-all duration-300"
                      >
                        <FiShare2 className="mr-1" /> Share
                      </Button>
                    </div>
                  </div>

                  {/* Side by Side Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Original Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          Original Room
                        </h3>
                        <div className="ml-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openImageModal(URL.createObjectURL(uploadedImage), "original")}
                            className="text-gray-600 hover:text-indigo-600 text-xs"
                          >
                            <FiZoomIn className="mr-1" /> View Full Size
                          </Button>
                        </div>
                      </div>
                      <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                        {uploadedImage ? (
                          <Image 
                            src={URL.createObjectURL(uploadedImage)}
                            alt="Original Room" 
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => openImageModal(URL.createObjectURL(uploadedImage), "original")}
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                              <FiUpload className="mx-auto text-3xl mb-2" />
                              <p className="text-sm">No original image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Generated Image */}
                    <div className="space-y-4 w-full">
                      <div className="flex w-full items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          AI Generated Design
                        </h3>
                        <div className="ml-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openImageModal(generatedImage, "generated")}
                            className="text-gray-600 hover:text-indigo-600 text-xs"
                          >
                            <FiZoomIn className="mr-1" /> View Full Size
                          </Button>
                        </div>
                      </div>
                      <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                        {generatedImage ? (
                          <Image 
                            src={generatedImage}
                            alt="Generated Interior Design" 
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => openImageModal(generatedImage, "generated")}
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                              <MdOutlineDesignServices className="mx-auto text-3xl mb-2" />
                              <p className="text-sm">Generate to see comparison</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Design Prompt */}
                  {usedPrompt && (
                    <div className="mt-8 bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-6 rounded-xl border border-indigo-200">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          <MdOutlineDesignServices className="text-xl text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-3 text-base">Design Prompt:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded-lg border border-indigo-200 shadow-sm">
                            {usedPrompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Cost Estimation */}
              <div className="xl:col-span-1">
                {costEstimation && (
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 h-fit">
                    <div className="flex items-center mb-8">
                      <div className="p-4 bg-emerald-100 rounded-xl mr-5">
                        <MdAttachMoney className="text-2xl text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Cost Estimation</h3>
                        <p className="text-gray-600 text-base">Renovation costs for {country}</p>
                      </div>
                    </div>

                    {/* Total Cost */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 mb-8">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Total Estimated Cost</h4>
                        <p className="text-4xl font-bold text-emerald-700 mb-2">{costEstimation.total_cost}</p>
                        <p className="text-sm text-gray-500">{costEstimation.currency}</p>
                      </div>
                    </div>

                    {/* Cost Breakdown - Show All Items */}
                    {costEstimation.breakdown && costEstimation.breakdown.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-5">Cost Breakdown</h4>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {costEstimation.breakdown.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 text-base mb-1">{item.category}</h5>
                                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="font-bold text-gray-900 text-lg">{item.cost}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shopping Links - Show All Items */}
                    {costEstimation.items && costEstimation.items.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-5">Shopping Links</h4>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {costEstimation.items.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center mb-3">
                                <h5 className="text-gray-900 font-semibold text-base">{item.item}</h5>
                                <span className="font-bold text-gray-900 text-lg">{item.cost}</span>
                              </div>
                              {item.shopping_links && item.shopping_links.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {item.shopping_links.map((link, linkIndex) => (
                                    <a
                                      key={linkIndex}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-sm font-medium rounded-lg border border-indigo-300 transition-colors duration-200"
                                    >
                                      {link.platform}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw Response Fallback */}
                    {costEstimation.raw_response && (!costEstimation.breakdown || costEstimation.breakdown.length === 0) && (
                      <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-indigo-900 mb-3 text-base">Cost Analysis</h4>
                        <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">{costEstimation.raw_response}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Shops Section - Full Width */}
            <div className="bg-white rounded-3xl shadow-2xl p-4 border border-gray-100">
              <NearbyShops />
            </div>
          </div>
        )}

        {/* Input Section - Show below images */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <div className="flex items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-fuchsia-100 rounded-2xl mr-6">
              <MdOutlineDesignServices className="text-3xl text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Interior Design Generator</h2>
              <p className="text-gray-600">Generate designs and get detailed renovation costs for your country</p>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-2xl p-2">
              <button
                onClick={() => setActiveTab("describe")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "describe"
                      ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
              >
                <MdOutlineDesignServices className="inline mr-2" />
                Describe Interior
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "upload"
                      ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
              >
                <FiUpload className="inline mr-2" />
                Transform Room
              </button>
            </div>
          </div>

          {/* Country Selection */}
          <div className="mb-8">
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
          
          <div className="bg-gradient-to-br from-indigo-50 to-fuchsia-50 rounded-2xl p-8">
            {activeTab === "describe" ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">Describe Your Interior Design</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPromptTemplates(true)}
                      className="text-indigo-600 hover:text-indigo-700 border-indigo-300 hover:border-indigo-400"
                    >
                      <FiInfo className="mr-1" />
                      Prompt Ideas
                    </Button>
                  </div>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your interior design in detail... (e.g., 'Modern living room with white sofa, wooden coffee table, plants, large windows, natural lighting, minimalist decor')"
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <Button
                  onClick={handleGenerateInterior}
                  disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  {loading ? "Generating Design & Cost..." : "Generate Interior Design & Cost"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Room Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {uploadedImage && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <p className="text-sm text-emerald-600 mb-2">✓ Image uploaded: {uploadedImage.name}</p>
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image 
                          src={URL.createObjectURL(uploadedImage)}
                          alt="Uploaded room" 
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-lg"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Describe Your Renovation</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe how you want to transform this room... (e.g., 'Convert to modern minimalist style with neutral colors, add plants, change furniture to contemporary pieces')"
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <Button
                  onClick={handleGenerateInterior}
                  disabled={loading || !uploadedImage}
                    className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  {loading ? "Transforming Room & Calculating Cost..." : "Transform Room & Get Cost"}
                </Button>
              </div>
            )}
          </div>

          {/* Interior Design Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-3">Room Types</h4>
              <p className="text-indigo-700 text-sm">Living room, bedroom, kitchen, bathroom, office, dining room</p>
            </div>
            <div className="bg-fuchsia-50 p-6 rounded-xl border border-fuchsia-100">
              <h4 className="font-semibold text-fuchsia-900 mb-3">Design Styles</h4>
              <p className="text-fuchsia-700 text-sm">Modern, scandinavian, industrial, bohemian, traditional, minimalist</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h4 className="font-semibold text-emerald-900 mb-3">Key Elements</h4>
              <p className="text-emerald-700 text-sm">Furniture, colors, lighting, textures, plants, artwork, layout</p>
            </div>
          </div>
        </div>
      </main>

      {/* Prompt Templates Modal */}
      <Dialog open={showPromptTemplates} onOpenChange={setShowPromptTemplates}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Interior Design Prompt Ideas</DialogTitle>
            <p className="text-gray-600">Click on any prompt to use it in your design description</p>
          </DialogHeader>
          
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {promptTemplates.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.prompts.map((template, templateIndex) => (
                    <div
                      key={templateIndex}
                      onClick={() => copyPromptTemplate(template)}
                      className="p-4 bg-gradient-to-br from-indigo-50 to-fuchsia-50 rounded-xl border border-indigo-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-indigo-300 group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {templateIndex + 1}
                        </div>
                        <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                          {template}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={modalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden bg-white p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center">
              <FiZoomIn className="mr-2 h-5 w-5 text-indigo-500" />
              {modalImage?.type === "original" ? "Original Room" : "AI Generated Design"}
            </DialogTitle>
          </DialogHeader>
          
          {modalImage && (
            <div className="flex items-center justify-center bg-white" style={{ height: 'calc(95vh - 140px)' }}>
              <Image 
                src={modalImage.url} 
                alt={modalImage.type === "original" ? "Original Room" : "Generated Interior Design"} 
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                style={{ width: 'auto', height: 'auto' }}
                unoptimized
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2 p-6 pt-0">
            <Button
              variant="outline"
              onClick={closeImageModal}
            >
              <FiX className="mr-2 h-4 w-4" />
              Close
            </Button>
            {modalImage && (
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = modalImage.url;
                  link.download = `${modalImage.type}-design-${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
