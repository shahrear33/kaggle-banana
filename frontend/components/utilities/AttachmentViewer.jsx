"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/components/dialog';
import { Button } from '@/components/ui/components/button';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, FileCode } from 'lucide-react';
import Image from 'next/image';

const AttachmentViewer = ({ isOpen, onClose, attachment }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (attachment && isOpen) {
      setLoading(true);
      setError(null);
      
      // Determine file type from URL or name
      const url = attachment.url || '';
      const name = attachment.name || '';
      const extension = url.split('.').pop().toLowerCase() || name.split('.').pop().toLowerCase();
      
      // Set file type based on extension
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        setFileType('image');
      } else if (extension === 'pdf') {
        setFileType('pdf');
      } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        setFileType('document');
      } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        setFileType('video');
      } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
        setFileType('audio');
      } else if (['html', 'htm', 'js', 'css', 'json', 'py', 'java', 'cpp', 'c', 'cs'].includes(extension)) {
        setFileType('code');
      } else {
        setFileType('other');
      }
      
      setLoading(false);
    }
  }, [attachment, isOpen]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-500 mb-2">
            <X size={48} />
          </div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Failed to load attachment</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
        </div>
      );
    }
    
    if (!attachment?.url) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-2">
            <FileText size={48} />
          </div>
          <p className="text-lg font-medium">No preview available</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This attachment cannot be previewed</p>
        </div>
      );
    }
    
    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center p-4 max-h-[70vh] overflow-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src={attachment.url} 
                alt={attachment.name || "Image attachment"} 
                width={800}
                height={600}
                className="max-w-full h-auto object-contain rounded-md"
                style={{ maxHeight: 'calc(70vh - 120px)' }}
                onError={() => setError("Failed to load image")}
              />
            </motion.div>
          </div>
        );
        
      case 'pdf':
        return (
          <div className="w-full h-[70vh]">
            <iframe 
              src={`${attachment.url}#view=FitH`} 
              className="w-full h-full border-0 rounded-md"
              title={attachment.name || "PDF Document"}
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="w-full max-h-[70vh] flex items-center justify-center">
            <video 
              controls 
              className="max-w-full max-h-[calc(70vh-120px)] rounded-md"
            >
              <source src={attachment.url} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
        
      case 'audio':
        return (
          <div className="w-full p-8 flex items-center justify-center">
            <audio controls className="w-full max-w-md">
              <source src={attachment.url} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            {fileType === 'code' ? (
              <FileCode size={48} className="text-indigo-500 mb-4" />
            ) : fileType === 'document' ? (
              <FileText size={48} className="text-blue-500 mb-4" />
            ) : (
              <FileText size={48} className="text-gray-400 mb-4" />
            )}
            <p className="text-lg font-medium">Preview not available</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              {attachment.name || "This file"} cannot be previewed directly in the browser
            </p>
            <div className="flex space-x-4 mt-2">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => window.open(attachment.url, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in new tab
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {fileType === 'image' && <ImageIcon className="mr-2 h-5 w-5 text-indigo-500" />}
            {fileType === 'pdf' && <FileText className="mr-2 h-5 w-5 text-red-500" />}
            {fileType === 'code' && <FileCode className="mr-2 h-5 w-5 text-green-500" />}
            {fileType === 'document' && <FileText className="mr-2 h-5 w-5 text-blue-500" />}
            {attachment?.name || "Attachment"}
          </DialogTitle>
        </DialogHeader>
        
        {renderContent()}
        
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {attachment?.size ? `${(attachment.size / 1024).toFixed(2)} KB` : ''}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => window.open(attachment.url, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentViewer;
