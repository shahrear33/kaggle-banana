'use client';

import { useEffect, useRef, useState } from 'react';

const Interactive3DViewer = ({ imageUrl }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rotation, setRotation] = useState({ x: -15, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lastRotation, setLastRotation] = useState({ x: -15, y: 0 });

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
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastRotation({ ...rotation });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotation({
      x: Math.max(-60, Math.min(60, lastRotation.x - deltaY * 0.5)),
      y: lastRotation.y + deltaX * 0.5
    });
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomSpeed = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomSpeed : zoom + zoomSpeed;
    setZoom(Math.max(0.3, Math.min(3, newZoom)));
  };

  // Touch controls
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setLastRotation({ ...rotation });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    
    setRotation({
      x: Math.max(-60, Math.min(60, lastRotation.x - deltaY * 0.5)),
      y: lastRotation.y + deltaX * 0.5
    });
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);
  };

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('wheel', handleWheel);

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, rotation, lastRotation, zoom]);

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
        className="w-full h-[500px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative bg-gradient-to-br from-gray-900 to-gray-800 select-none"
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {imageLoaded && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              transformOrigin: 'center center'
            }}
          >
            <div
              style={{
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <img 
                src={imageUrl}
                alt="3D Interior" 
                style={{ 
                  maxWidth: '90%', 
                  maxHeight: '90%', 
                  objectFit: 'contain',
                  borderRadius: '1rem',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                  filter: 'brightness(1.1) contrast(1.05)',
                  pointerEvents: 'none'
                }}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* 3D Controls overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white pointer-events-none">
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
            setRotation({ x: -15, y: 0 });
            setZoom(1);
            setLastRotation({ x: -15, y: 0 });
          }}
          className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors pointer-events-auto"
        >
          Reset View
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs pointer-events-none">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

export default Interactive3DViewer;
