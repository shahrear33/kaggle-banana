"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/components/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/components/toaster";
import Image from "next/image";
import { FiDownload, FiShare2, FiArrowLeft } from "react-icons/fi";
import { MdOutlineArchitecture } from "react-icons/md";
import { BsBuilding } from "react-icons/bs";
import Hero from "@/components/utils/Hero";
import TextToImage from "@/components/ai/TextToImage";

export default function Architecture() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [usedPrompt, setUsedPrompt] = useState("");
  const router = useRouter();
  const { toast } = useToast();

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
      link.download = `3d-architecture-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Architecture image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100 font-sans">
      {/* Navigation */}
      <Hero />

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-cyan-900 text-white py-20 overflow-hidden">
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
            <BsBuilding className="mr-2" />
            3D Architecture Generation
          </div>
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight text-white mb-6">
            Create Stunning <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3D Architecture</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Transform your architectural vision into photorealistic 3D structures. Describe your building concept and watch our AI generate detailed architectural visualizations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 py-16">
        {/* Generation Interface */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 mb-16">
          <div className="flex items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mr-6">
              <MdOutlineArchitecture className="text-3xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Architecture Generator</h2>
              <p className="text-gray-600">Describe your architectural vision in detail for best results</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
            <TextToImage 
              onGenerated={(url, prompt) => { 
                setGeneratedImage(url); 
                setUsedPrompt(prompt); 
              }} 
              placeholder="Describe your architectural design... (e.g., 'Modern glass office building with steel frame, 20 stories, minimalist design, urban setting, evening lighting')"
            />
          </div>

          {/* Architecture Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-3">Building Types</h4>
              <p className="text-blue-700 text-sm">Residential, commercial, industrial, institutional, mixed-use developments</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-3">Architectural Styles</h4>
              <p className="text-indigo-700 text-sm">Modern, contemporary, classical, brutalist, art deco, minimalist</p>
            </div>
            <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
              <h4 className="font-semibold text-cyan-900 mb-3">Details to Include</h4>
              <p className="text-cyan-700 text-sm">Materials, lighting, surroundings, scale, architectural features</p>
            </div>
          </div>
        </div>

        {/* Generated Image Display */}
        {generatedImage && (
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Your 3D Architecture</h3>
                <p className="text-gray-600">Professional architectural visualization ready for download</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FiDownload className="mr-2" /> Download HD
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:border-blue-300 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  <FiShare2 className="mr-2" /> Share
                </Button>
              </div>
            </div>
            
            <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <Image 
                src={generatedImage}
                alt="Generated 3D Architecture" 
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-2xl"
                unoptimized
              />
            </div>
            
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MdOutlineArchitecture className="text-2xl text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Architecture Prompt:</h4>
                  <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                    {usedPrompt || "No prompt available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
}
