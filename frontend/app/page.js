"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/components/button";
import { Input } from "@/components/ui/components/input";
import { Textarea } from "@/components/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Toaster } from "@/components/ui/components/toaster";
import Image from "next/image";
import { FiImage, FiUpload, FiDownload, FiShare2, FiArrowRight } from "react-icons/fi";
import { MdOutlineArchitecture, MdOutlineDesignServices } from "react-icons/md";
import { BsBuilding, BsGrid3X3 } from "react-icons/bs";
import Hero from "@/components/utils/Hero";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  const handleArchitectureChoice = () => {
    router.push('/architecture');
  };

  const handleInteriorChoice = () => {
    router.push('/interior');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Navigation */}
      <Hero />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                AI-Powered 3D Visualization
              </div>
              <h2 className="text-5xl md:text-6xl font-extralight tracking-tight leading-tight text-white">
                Transform Your <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Space</span> into Reality
              </h2>
            </div>
            <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
              Choose your path: Generate stunning 3D architectural structures from scratch or transform your existing interior spaces with AI-powered visualization technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleArchitectureChoice}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <BsBuilding className="mr-2" /> 3D Architecture
              </Button>
              <Button 
                size="lg" 
                onClick={handleInteriorChoice}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <MdOutlineDesignServices className="mr-2" /> Interior Design
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
              <Image 
                src="/assets/photo.png" 
                alt="3D Architectural Visualization" 
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          </div>
        </div>
      </section>

      {/* Main Content - Service Selection */}
      <main className="max-w-7xl mx-auto p-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extralight text-gray-900 mb-4">
            Choose Your <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Creative Path</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select the type of visualization you want to create with our advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 3D Architecture Generation Card */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={handleArchitectureChoice}>
            <div className="flex items-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mr-6 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300">
                <BsBuilding className="text-3xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">3D Architecture Generation</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Create stunning 3D architectural structures from scratch. Design buildings, houses, and complex architectural forms using AI-powered generation from your descriptions.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Exterior & Interior Design</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-700 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Structural Visualization</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-700 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Material & Lighting Simulation</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-300">
              Start Creating Architecture <FiArrowRight className="ml-2" />
            </Button>
          </div>

          {/* Interior Design Visualization Card */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={handleInteriorChoice}>
            <div className="flex items-center mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mr-6 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors duration-300">
                <MdOutlineDesignServices className="text-3xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Interior Design Visualization</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Transform existing spaces or visualize new interior designs. Upload room photos or describe your vision to see stunning interior transformations.
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Room Layout & Furniture</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-700 mt-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Color Schemes & Textures</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-700 mt-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Lighting & Ambiance</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300">
              Start Interior Design <FiArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extralight text-gray-900 mb-4">
              Why Choose <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3D Vision AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology meets professional-grade visualization capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 inline-block rounded-2xl mb-6 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300">
                <MdOutlineArchitecture className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">3D Precision</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Generate accurate 3D architectural models with proper proportions, realistic materials, and professional lighting that meets industry standards.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 inline-block rounded-2xl mb-6 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors duration-300">
                <MdOutlineDesignServices className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Interior Intelligence</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Transform interior spaces with intelligent furniture placement, color coordination, and lighting design that creates harmonious living environments.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 inline-block rounded-2xl mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors duration-300">
                <BsGrid3X3 className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Instant Results</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Get professional-quality visualizations in seconds, not hours. Our AI processes your requirements and delivers stunning results instantly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MdOutlineArchitecture className="text-2xl text-blue-400" />
                <h3 className="text-xl font-light text-white">3D VISION <span className="font-bold">AI</span></h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Revolutionizing architectural visualization and interior design with cutting-edge AI technology.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/architecture" className="hover:text-blue-400 transition-colors">3D Architecture</Link></li>
                <li><Link href="/interior" className="hover:text-blue-400 transition-colors">Interior Design</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Space Planning</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Visualization</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} 3D Vision AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Twitter</Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">LinkedIn</Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
