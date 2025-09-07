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
import { FiDownload, FiShare2, FiArrowLeft, FiUpload, FiDollarSign, FiZoomIn, FiX } from "react-icons/fi";
import { MdOutlineDesignServices, MdAttachMoney, MdCompare } from "react-icons/md";
import Hero from "@/components/utils/Hero";

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
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 font-sans">
      {/* Navigation */}
      <Hero />

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mb-8 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Button>
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
            <MdOutlineDesignServices className="mr-2" />
            Interior Design Visualization
          </div>
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight text-white mb-6">
            Transform Your <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Interior Space</span>
          </h1>
          <p className="text-xl text-purple-100 leading-relaxed max-w-3xl mx-auto">
            Redesign your living spaces with AI-powered interior visualization. Create new designs from descriptions or transform existing rooms with uploaded photos.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 py-16">
        {/* Images Section - Show above input only after generation */}
        {generatedImage && (
          <div className="mb-16">
            {/* Image Comparison Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mr-4">
                    <MdCompare className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">Before & After Comparison</h2>
                    <p className="text-gray-600">See how your space transforms with AI-powered design</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={downloadImage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FiDownload className="mr-2" /> Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 hover:border-purple-300 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                  >
                    <FiShare2 className="mr-2" /> Share
                  </Button>
                </div>
              </div>

              {/* Side by Side Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      Original Room
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openImageModal(URL.createObjectURL(uploadedImage), "original")}
                      className="text-gray-600 hover:text-purple-600"
                    >
                      <FiZoomIn className="mr-1" /> View Full Size
                    </Button>
                  </div>
                  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {uploadedImage ? (
                      <Image 
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Original Room" 
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => openImageModal(URL.createObjectURL(uploadedImage), "original")}
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <FiUpload className="mx-auto text-4xl mb-2" />
                          <p>No original image uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generated Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      AI Generated Design
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openImageModal(generatedImage, "generated")}
                      className="text-gray-600 hover:text-purple-600"
                    >
                      <FiZoomIn className="mr-1" /> View Full Size
                    </Button>
                  </div>
                  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {generatedImage ? (
                      <Image 
                        src={generatedImage}
                        alt="Generated Interior Design" 
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => openImageModal(generatedImage, "generated")}
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MdOutlineDesignServices className="mx-auto text-4xl mb-2" />
                          <p>Generate a design to see the comparison</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Design Prompt */}
              {usedPrompt && (
                <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <MdOutlineDesignServices className="text-xl text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Design Prompt:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        {usedPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cost Estimation Section */}
            {costEstimation && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-100 rounded-xl mr-4">
                    <MdAttachMoney className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Cost Estimation</h3>
                    <p className="text-gray-600">Renovation costs for {country}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Total Cost */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Total Estimated Cost</h4>
                        <p className="text-sm text-gray-600">Complete renovation budget</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-700">{costEstimation.total_cost}</p>
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Item Details & Shopping Links</h4>
                      <div className="space-y-4">
                        {costEstimation.items.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h5 className="text-gray-900 font-semibold">{item.item}</h5>
                                {item.quantity && <span className="text-gray-500 text-sm">Quantity: {item.quantity}</span>}
                              </div>
                              <span className="font-bold text-gray-900 text-lg">{item.cost}</span>
                            </div>
                            
                            {/* Shopping Links */}
                            {item.shopping_links && item.shopping_links.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Where to buy:</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.shopping_links.map((link, linkIndex) => (
                                    <a
                                      key={linkIndex}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium rounded-lg border border-blue-300 transition-colors duration-200"
                                    >
                                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                      </svg>
                                      {link.platform}
                                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  ))}
                                </div>
                                {item.shopping_links[0]?.note && (
                                  <p className="text-xs text-gray-600 mt-2 italic">{item.shopping_links[0].note}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Response Fallback */}
                  {costEstimation.raw_response && (!costEstimation.breakdown || costEstimation.breakdown.length === 0) && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Cost Analysis</h4>
                      <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">{costEstimation.raw_response}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Section - Show below images */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="flex items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mr-6">
              <MdOutlineDesignServices className="text-3xl text-purple-600" />
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
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <MdOutlineDesignServices className="inline mr-2" />
                Describe Interior
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "upload"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-purple-600"
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
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              {countries.map((countryOption) => (
                <option key={countryOption} value={countryOption}>
                  {countryOption}
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
            {activeTab === "describe" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Describe Your Interior Design</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your interior design in detail... (e.g., 'Modern living room with white sofa, wooden coffee table, plants, large windows, natural lighting, minimalist decor')"
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                <Button
                  onClick={handleGenerateInterior}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all duration-300"
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
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {uploadedImage && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-600 mb-2">✓ Image uploaded: {uploadedImage.name}</p>
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
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                <Button
                  onClick={handleGenerateInterior}
                  disabled={loading || !uploadedImage}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  {loading ? "Transforming Room & Calculating Cost..." : "Transform Room & Get Cost"}
                </Button>
              </div>
            )}
          </div>

          {/* Interior Design Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-3">Room Types</h4>
              <p className="text-purple-700 text-sm">Living room, bedroom, kitchen, bathroom, office, dining room</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
              <h4 className="font-semibold text-pink-900 mb-3">Design Styles</h4>
              <p className="text-pink-700 text-sm">Modern, scandinavian, industrial, bohemian, traditional, minimalist</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
              <h4 className="font-semibold text-rose-900 mb-3">Key Elements</h4>
              <p className="text-rose-700 text-sm">Furniture, colors, lighting, textures, plants, artwork, layout</p>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      <Dialog open={modalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden bg-white p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center">
              <FiZoomIn className="mr-2 h-5 w-5 text-purple-500" />
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
