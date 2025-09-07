"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/components/textarea";
import { Button } from "@/components/ui/components/button";
import { FiUpload, FiImage } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";

export default function ImageTransform({ onGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt || !file) {
      toast({ title: "Error", description: "Please enter a prompt and upload an image", variant: "destructive" });
      return;
    }

    // Basic validation for file type and size
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Error", description: "Invalid file type. Please upload PNG, JPG, or WEBP images.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({ title: "Error", description: "File size too large. Maximum size is 10MB.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("image", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/v1/generate-image-upload`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "69420" },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.image_url) {
        onGenerated?.(data.image_url, prompt);
        toast({ title: "Success", description: "Image generated successfully" });
      } else {
        toast({ title: "Error", description: data.detail || data.message || "Failed to generate image", variant: "destructive" });
        console.error("API response:", data);
      }
    } catch (e) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the transformation (e.g., 'Convert this traditional living room into an industrial loft style with exposed brick walls and steel beams')"
        className="w-full h-32 mb-4 border-gray-300 focus:ring-gray-500 focus:border-gray-500 rounded-md"
      />
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <FiUpload className="text-3xl text-gray-400 mb-2" />
          <span className="text-gray-600">Click to upload or drag and drop</span>
          <span className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP up to 10MB</span>
        </label>
        {file && (
          <div className="mt-4 text-left text-sm text-gray-600">Selected: {file.name}</div>
        )}
      </div>
      <Button onClick={handleGenerate} disabled={loading} className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-md flex items-center justify-center">
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <FiImage className="mr-2" /> Transform Space
          </>
        )}
      </Button>
    </div>
  );
}
