"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/components/textarea";
import { Button } from "@/components/ui/components/button";
import { useToast } from "@/hooks/use-toast";

export default function TextToImage({ onGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ title: "Error", description: "Please enter a prompt", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/v1/generate-image-prompt`, {
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
      <div className="mb-6">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your architectural vision (e.g., 'A minimalist open-concept living space with floor-to-ceiling windows, concrete floors, and wooden accent walls')"
          className="w-full h-32 border-gray-300 focus:ring-gray-500 focus:border-gray-500 rounded-md"
        />
      </div>
      <Button onClick={handleGenerate} disabled={loading} className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-md flex items-center justify-center">
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>Generate Visualization</>
        )}
      </Button>
    </div>
  );
}
