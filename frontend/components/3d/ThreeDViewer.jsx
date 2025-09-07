'use client';

import { useEffect, useRef, useState } from 'react';

const ThreeDViewer = ({ imageUrl, rooms = [], onRoomClick, selectedRoom }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);


  // Handle image load
  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      setError(null);
      
      // Create a test image to check if URL is valid
      const testImg = new Image();
      testImg.onload = () => {
        setImageLoaded(true);
        setIsLoading(false);
      };
      testImg.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };
      testImg.src = imageUrl;
    }
  }, [imageUrl]);

  // Mouse/touch controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomSpeed : zoom + zoomSpeed;
    setZoom(Math.max(0.5, Math.min(3, newZoom)));
  };

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel);
    container.addEventListener('mouseleave', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, dragStart, zoom]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D viewer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-2xl">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        className="w-full h-[500px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative"
        style={{ touchAction: 'none' }}
      >
        {imageLoaded && (
          <div
            className="w-full h-full"
            style={{
              transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <img 
              src={imageUrl}
              alt="3D Interior" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                borderRadius: '1rem'
              }}
            />
          </div>
        )}
        
        {/* Room overlays - positioned over the image */}
        {rooms.map((room, index) => (
          <div
            key={room.id}
            onClick={() => onRoomClick && onRoomClick(room)}
            className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-300 group ${
              selectedRoom?.id === room.id 
                ? 'border-emerald-500 bg-emerald-500/30' 
                : 'border-indigo-500 bg-indigo-500/0 hover:bg-indigo-500/20'
            }`}
            style={{
              left: `${room.coordinates.x}px`,
              top: `${room.coordinates.y}px`,
              width: `${room.coordinates.width}px`,
              height: `${room.coordinates.height}px`,
            }}
          >
            <div className="absolute -top-8 left-0 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {room.label}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-indigo-700 font-semibold text-sm bg-white/90 px-3 py-1 rounded-lg shadow-md">
                Click to design
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDViewer;
