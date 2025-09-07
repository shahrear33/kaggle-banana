'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const SimpleImageViewer = ({ imageUrl, rooms = [], onRoomClick, selectedRoom }) => {
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Calculate scaling and positioning when image loads
  useEffect(() => {
    if (imageUrl && containerRef.current) {
      const updateDimensions = () => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Create a temporary image to get natural dimensions
        const tempImg = new window.Image();
        tempImg.onload = () => {
          const imageWidth = tempImg.naturalWidth;
          const imageHeight = tempImg.naturalHeight;

          // Calculate scale to fit image in container with object-fit: contain
          const scaleX = containerWidth / imageWidth;
          const scaleY = containerHeight / imageHeight;
          const scale = Math.min(scaleX, scaleY);

          // Calculate actual image dimensions after scaling
          const scaledWidth = imageWidth * scale;
          const scaledHeight = imageHeight * scale;

          // Calculate offset to center the image
          const offsetX = (containerWidth - scaledWidth) / 2;
          const offsetY = (containerHeight - scaledHeight) / 2;

          setImageDimensions({ width: imageWidth, height: imageHeight });
          setContainerDimensions({ width: containerWidth, height: containerHeight });
          setScale(scale);
          setOffset({ x: offsetX, y: offsetY });
        };
        tempImg.src = imageUrl;
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [imageUrl]);

  // Handle room click - generate interior for the room
  const handleRoomClick = (room) => {
    // Call the original onRoomClick for interior generation
    if (onRoomClick) {
      onRoomClick(room);
    }
  };

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-2xl">
        <p className="text-gray-600">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 relative"
      >
        <Image 
          ref={imageRef}
          src={imageUrl}
          alt="3D Interior with Room Detection" 
          fill
          style={{ objectFit: 'contain' }}
          className="rounded-2xl"
          unoptimized
        />
        
        {/* Room Overlays - Only show on hover */}
        {rooms.map((room, index) => {
          // Calculate scaled coordinates
          const scaledX = room.coordinates.x * scale + offset.x;
          const scaledY = room.coordinates.y * scale + offset.y;
          const scaledWidth = room.coordinates.width * scale;
          const scaledHeight = room.coordinates.height * scale;

          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-300 group ${
                selectedRoom?.id === room.id 
                  ? 'border-emerald-500 bg-emerald-500/30 opacity-100' 
                  : hoveredRoom === room.id
                  ? 'border-indigo-500 bg-indigo-500/20 opacity-100'
                  : 'border-indigo-500 bg-indigo-500/0 opacity-0'
              }`}
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
            >
              <div className="absolute -top-8 left-0 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {room.label}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-indigo-700 font-semibold text-xs bg-white/90 px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to generate interior
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default SimpleImageViewer;
