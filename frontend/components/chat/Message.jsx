"use client"
import { useEffect, useState } from 'react';

export default function Message({ sender, messageContent, image }) {
  const isOwner = sender === 'owner';
  
  return (
    <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
        isOwner 
          ? 'bg-purple-600 text-white rounded-br-none' 
          : 'bg-slate-700 text-white rounded-bl-none'
      }`}>
        {image && (
          <div className="mb-2">
            <img 
              src={image}  // Use the image URL directly
              alt="Shared image" 
              className="max-w-full rounded-lg"
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{messageContent}</p>
      </div>
    </div>
  );
} 