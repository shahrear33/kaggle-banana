"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { Button } from './button';

export default function ImageUpload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const addImages = (files) => {
    const validImages = files.filter(file => file.type.startsWith('image/'));
    if (validImages.length === 0) return;

    setSelectedImages(prevImages => [...prevImages, ...validImages]);

    const newPreviews = validImages.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

    console.log('Selected Images:', validImages);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setPreviews(updatedPreviews);

    console.log('Updated Images:', updatedImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadImages = async () => {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append('image_files', image);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/ai/image-upload-tagging`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFyYWZAZ21haWwuY29tIiwibmFtZSI6IkFyYWYiLCJyb2xlIjoiVVNFUiIsImV4cCI6MTczNTkzODYxNH0.tY8vxfIAd5uMxtu5EzPRqDtVQWq1Nikd0p1jhOjJH7s"
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-4 text-lg font-medium text-gray-900 dark:text-gray-300">
        Upload Images
      </label>

      <div
        className={`flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <FaUpload className="text-5xl text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Drag & drop images here, or click to select files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src={preview.url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
                title="Remove Image"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleUploadImages}
            variant="primary"
            className="flex items-center space-x-2 px-6 py-3 text-lg"
            leftIcon={<FaUpload />}
          >
            Upload Images
          </Button>
        </div>
      )}
    </div>
  );
} 