'use client';

import { useEffect, useRef, useState } from 'react';

const Real3DViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rotation, setRotation] = useState({ x: -20, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });

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
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.3)),
      y: prev.y + deltaX * 0.3
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomSpeed : zoom + zoomSpeed;
    setZoom(Math.max(0.5, Math.min(2.5, newZoom)));
  };

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDownEvent = (e) => handleMouseDown(e);
    const handleMouseMoveEvent = (e) => handleMouseMove(e);
    const handleMouseUpEvent = (e) => handleMouseUp(e);
    const handleWheelEvent = (e) => handleWheel(e);

    container.addEventListener('mousedown', handleMouseDownEvent);
    document.addEventListener('mousemove', handleMouseMoveEvent);
    document.addEventListener('mouseup', handleMouseUpEvent);
    container.addEventListener('wheel', handleWheelEvent);

    return () => {
      container.removeEventListener('mousedown', handleMouseDownEvent);
      document.removeEventListener('mousemove', handleMouseMoveEvent);
      document.removeEventListener('mouseup', handleMouseUpEvent);
      container.removeEventListener('wheel', handleWheelEvent);
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
        className="w-full h-[500px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative bg-gradient-to-br from-gray-900 to-gray-800"
        style={{ touchAction: 'none' }}
      >
        {imageLoaded && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom}) translateX(${pan.x}px) translateY(${pan.y}px)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              transformOrigin: 'center center'
            }}
          >
            <img 
              src={imageUrl}
              alt="3D Interior" 
              style={{ 
                maxWidth: '85%', 
                maxHeight: '85%', 
                objectFit: 'contain',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                filter: 'brightness(1.1) contrast(1.05)'
              }}
            />
          </div>
        )}
      </div>
      
      {/* 3D Controls overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white">
        <div className="text-xs space-y-1">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>📐 3D perspective view</div>
        </div>
      </div>

      {/* Reset button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => {
            setRotation({ x: -20, y: 0 });
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default Real3DViewer;
