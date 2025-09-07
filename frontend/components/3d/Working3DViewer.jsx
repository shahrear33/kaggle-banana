'use client';

import { useEffect, useRef, useState } from 'react';

const Working3DViewer = ({ imageUrl, rooms = [], onRoomClick, selectedRoom }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // Handle image load
  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      setError(null);
      
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
      x: Math.max(-30, Math.min(30, prev.x + deltaY * 0.3)),
      y: prev.y + deltaX * 0.3
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
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
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
        className="w-full h-[500px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative bg-gray-100"
        style={{ touchAction: 'none' }}
      >
        {imageLoaded && (
          <div
            className="w-full h-full flex items-center justify-center"
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
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: '1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}
        
        {/* Room overlays - Only show on hover */}
        {rooms.map((room, index) => (
          <div
            key={room.id}
            onClick={() => onRoomClick && onRoomClick(room)}
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
              left: `${room.coordinates.x}px`,
              top: `${room.coordinates.y}px`,
              width: `${room.coordinates.width}px`,
              height: `${room.coordinates.height}px`,
            }}
          >
            <div className="absolute -top-8 left-0 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {room.label}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-indigo-700 font-semibold text-xs bg-white/90 px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

export default Working3DViewer;
