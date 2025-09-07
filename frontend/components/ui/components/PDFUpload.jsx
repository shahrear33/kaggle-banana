"use client"
import { useState, useRef } from 'react';
import { FaTrash, FaUpload, FaFilePdf } from 'react-icons/fa';
import { Button } from './button';

export default function PDFUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = '';
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
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please drop a PDF file');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadPDF = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdf_file', selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/pdf-upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-4 text-lg font-medium text-gray-900 dark:text-gray-300">
        Upload PDF
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
        <FaFilePdf className="text-5xl text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Drag & drop a PDF file here, or click to select
        </p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <div className="mt-8">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <FaFilePdf className="text-2xl text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-red-600 hover:text-red-700 focus:outline-none"
              title="Remove PDF"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleUploadPDF}
            variant="primary"
            className="flex items-center space-x-2 px-6 py-3 text-lg"
            leftIcon={<FaUpload />}
          >
            Upload PDF
          </Button>
        </div>
      )}
    </div>
  );
} 