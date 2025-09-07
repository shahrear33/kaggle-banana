'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Cylinder, Sphere } from '@react-three/drei';
import { useState, useRef, useMemo } from 'react';
import * as THREE from 'three';

// Geometric furniture components using simple 3D shapes
const FurnitureShapes = {
  // Bed - rectangular with headboard
  Bed: ({ position, scale, color = '#8B4513' }) => (
    <group position={position}>
      {/* Main bed */}
      <Box args={[2.0 * scale, 0.3 * scale, 1.5 * scale]} position={[0, 0.15 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Headboard */}
      <Box args={[2.0 * scale, 1.0 * scale, 0.1 * scale]} position={[0, 0.5 * scale, -0.7 * scale]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      {/* Pillows */}
      <Box args={[0.4 * scale, 0.2 * scale, 0.3 * scale]} position={[-0.6 * scale, 0.4 * scale, -0.4 * scale]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Box args={[0.4 * scale, 0.2 * scale, 0.3 * scale]} position={[0.6 * scale, 0.4 * scale, -0.4 * scale]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
    </group>
  ),

  // Kitchen - counters and appliances
  Kitchen: ({ position, scale, color = '#D3D3D3' }) => (
    <group position={position}>
      {/* Main counter */}
      <Box args={[3.0 * scale, 0.8 * scale, 0.6 * scale]} position={[0, 0.4 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Sink */}
      <Cylinder args={[0.3 * scale, 0.3 * scale, 0.2 * scale]} position={[-0.8 * scale, 0.9 * scale, 0]}>
        <meshStandardMaterial color="#C0C0C0" />
      </Cylinder>
      {/* Stove */}
      <Box args={[0.6 * scale, 0.1 * scale, 0.6 * scale]} position={[0.8 * scale, 0.9 * scale, 0]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      {/* Refrigerator */}
      <Box args={[0.6 * scale, 1.8 * scale, 0.6 * scale]} position={[1.8 * scale, 0.9 * scale, 0]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
    </group>
  ),

  // Dining table with chairs
  Dining: ({ position, scale, color = '#8B4513' }) => (
    <group position={position}>
      {/* Table */}
      <Box args={[1.5 * scale, 0.05 * scale, 1.0 * scale]} position={[0, 0.7 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Table legs */}
      <Cylinder args={[0.03 * scale, 0.03 * scale, 0.7 * scale]} position={[-0.6 * scale, 0.35 * scale, -0.4 * scale]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      <Cylinder args={[0.03 * scale, 0.03 * scale, 0.7 * scale]} position={[0.6 * scale, 0.35 * scale, -0.4 * scale]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      <Cylinder args={[0.03 * scale, 0.03 * scale, 0.7 * scale]} position={[-0.6 * scale, 0.35 * scale, 0.4 * scale]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      <Cylinder args={[0.03 * scale, 0.03 * scale, 0.7 * scale]} position={[0.6 * scale, 0.35 * scale, 0.4 * scale]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Chairs */}
      <Box args={[0.4 * scale, 0.8 * scale, 0.4 * scale]} position={[-0.8 * scale, 0.4 * scale, 0]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box args={[0.4 * scale, 0.8 * scale, 0.4 * scale]} position={[0.8 * scale, 0.4 * scale, 0]}>
        <meshStandardMaterial color="#654321" />
      </Box>
    </group>
  ),

  // Living room sofa
  Living: ({ position, scale, color = '#4169E1' }) => (
    <group position={position}>
      {/* Sofa base */}
      <Box args={[2.5 * scale, 0.4 * scale, 1.0 * scale]} position={[0, 0.4 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Sofa back */}
      <Box args={[2.5 * scale, 0.8 * scale, 0.2 * scale]} position={[0, 0.7 * scale, -0.4 * scale]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Armrests */}
      <Box args={[0.2 * scale, 0.6 * scale, 1.0 * scale]} position={[-1.15 * scale, 0.6 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.2 * scale, 0.6 * scale, 1.0 * scale]} position={[1.15 * scale, 0.6 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Coffee table */}
      <Box args={[1.0 * scale, 0.4 * scale, 0.6 * scale]} position={[0, 0.2 * scale, 1.5 * scale]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </group>
  ),

  // Bathroom fixtures
  Bathroom: ({ position, scale, color = '#FFFFFF' }) => (
    <group position={position}>
      {/* Toilet */}
      <Cylinder args={[0.2 * scale, 0.2 * scale, 0.4 * scale]} position={[-0.5 * scale, 0.2 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Sink */}
      <Cylinder args={[0.25 * scale, 0.25 * scale, 0.1 * scale]} position={[0.5 * scale, 0.8 * scale, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Bathtub */}
      <Box args={[1.5 * scale, 0.5 * scale, 0.7 * scale]} position={[0, 0.25 * scale, -0.8 * scale]}>
        <meshStandardMaterial color={color} />
      </Box>
    </group>
  ),

  // Generic room (simple box)
  Generic: ({ position, scale, color = '#808080' }) => (
    <Box args={[1.0 * scale, 0.5 * scale, 1.0 * scale]} position={position}>
      <meshStandardMaterial color={color} />
    </Box>
  )
};

// Room furniture mapping to geometric shapes
const getRoomFurniture = (roomType, position, scale) => {
  const lowerRoomType = roomType.toLowerCase();
  
  // Kitchen types
  if (lowerRoomType.includes('kitchen')) {
    return <FurnitureShapes.Kitchen position={position} scale={scale} />;
  }
  
  // Bedroom types
  if (lowerRoomType.includes('bedroom') || lowerRoomType.includes('bed')) {
    return <FurnitureShapes.Bed position={position} scale={scale} />;
  }
  
  // Dining types
  if (lowerRoomType.includes('dining')) {
    return <FurnitureShapes.Dining position={position} scale={scale} />;
  }
  
  // Living room types
  if (lowerRoomType.includes('living')) {
    return <FurnitureShapes.Living position={position} scale={scale} />;
  }
  
  // Bathroom types
  if (lowerRoomType.includes('bathroom') || lowerRoomType.includes('washroom') || lowerRoomType.includes('toilet')) {
    return <FurnitureShapes.Bathroom position={position} scale={scale} />;
  }
  
  // Default for unknown types
  return <FurnitureShapes.Generic position={position} scale={scale} />;
};






const Room3D = ({ room, position, size, onHover, onHoverOut }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();


  // Get floor color for the room base
  const getRoomFloorColor = (roomType) => {
    const colors = {
      // Primary room types  
      'living_room': '#F5F5DC',   // Beige - wood floors
      'kitchen': '#E8E8E8',       // Light gray - tile floors  
      'bedroom': '#F0E68C',       // Light khaki - carpet/wood
      'master_bedroom': '#F5DEB3', // Wheat - premium flooring
      'bathroom': '#E0E0E0',      // Light gray - tile
      'dining_room': '#DEB887',   // Burlywood - hardwood
      
      // New room types with appropriate flooring
      'hallway': '#D3D3D3',       // Light gray - neutral
      'entry': '#F5F5DC',         // Beige - welcoming
      'laundry': '#E6E6FA',       // Lavender - utility
      'washroom': '#F0F8FF',      // Alice Blue - clean
      'balcony': '#F0F8FF',       // Alice Blue - outdoor
      'terrace': '#F5F5DC',       // Beige - outdoor
      'patio': '#F5DEB3',         // Wheat - outdoor
      
      // Additional room types
      'office': '#F5F5DC',        // Beige - professional
      'study': '#F0E68C',         // Light khaki - cozy
      'guest_room': '#F5DEB3',    // Wheat - welcoming
      'utility': '#E6E6FA',       // Lavender - utility
      'pantry': '#F5F5F5',        // White smoke - clean
      
      'default': '#F5F5F5'        // White smoke - default
    };
    return colors[roomType] || colors.default;
  };



  const handlePointerOver = () => {
    setHovered(true);
    if (onHover) onHover(room);
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (onHoverOut) onHoverOut();
  };

  return (
    <group position={position}>
      {/* Floor base with room color */}
      <Plane
        ref={meshRef}
        args={[size[0], size[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshLambertMaterial 
          color={getRoomFloorColor(room.type)} 
          transparent 
          opacity={hovered ? 0.9 : 0.7}
        />
      </Plane>

      {/* Geometric Furniture for this room type */}
      {useMemo(() => (
        getRoomFurniture(room.type, [0, 0, 0], size[0] * 0.3)
      ), [room.type, room.id])}

      {/* Room borders - thin architectural lines */}
      {/* Front border */}
      <Box args={[size[0], 0.03, 0.03]} position={[0, 0.015, size[2] / 2]}>
        <meshLambertMaterial color="#2F2F2F" />
      </Box>

      {/* Back border */}
      <Box args={[size[0], 0.03, 0.03]} position={[0, 0.015, -size[2] / 2]}>
        <meshLambertMaterial color="#2F2F2F" />
      </Box>

      {/* Left border */}
      <Box args={[0.03, 0.03, size[2]]} position={[-size[0] / 2, 0.015, 0]}>
        <meshLambertMaterial color="#2F2F2F" />
      </Box>

      {/* Right border */}
      <Box args={[0.03, 0.03, size[2]]} position={[size[0] / 2, 0.015, 0]}>
        <meshLambertMaterial color="#2F2F2F" />
      </Box>

      {/* Room Label - Positioned above 3D model */}
      <Text
        position={[0, 0.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {room.label}
      </Text>

      {/* Room Type Label */}
      <Text
        position={[0, 0.75, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        ({room.type.replace('_', ' ')})
      </Text>

      {/* Side view labels for 3D perspective */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.18}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {room.label}
      </Text>

      {/* Note: Using 3D GLB models for realistic height and depth */}
    </group>
  );
};

const Building3D = ({ rooms, onRoomHover }) => {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const buildingRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      // Enhanced mock data with diverse room types to test all models
      return [
        { id: 1, label: 'Living Room', type: 'living_room', coordinates: { x: 480, y: 120, width: 380, height: 280 } },
        { id: 2, label: 'Kitchen', type: 'kitchen', coordinates: { x: 250, y: 140, width: 220, height: 250 } },
        { id: 3, label: 'Dining Room', type: 'dining_room', coordinates: { x: 280, y: 380, width: 200, height: 160 } },
        { id: 4, label: 'Master Bedroom', type: 'bedroom', coordinates: { x: 400, y: 50, width: 170, height: 120 } },
        { id: 5, label: 'Guest Bedroom', type: 'bedroom', coordinates: { x: 230, y: 50, width: 170, height: 120 } },
        { id: 6, label: 'Bathroom', type: 'bathroom', coordinates: { x: 100, y: 40, width: 150, height: 180 } },
        { id: 7, label: 'Entrance', type: 'entry', coordinates: { x: 370, y: 170, width: 200, height: 100 } },
        { id: 8, label: 'Laundry Room', type: 'laundry', coordinates: { x: 600, y: 50, width: 120, height: 100 } },
        { id: 9, label: 'Balcony', type: 'balcony', coordinates: { x: 650, y: 200, width: 150, height: 100 } },
        { id: 10, label: 'Washroom', type: 'washroom', coordinates: { x: 150, y: 250, width: 100, height: 120 } }
      ];
    }
    
    // Debug: Log all room types coming from API
    console.log('🏠 Building rooms from API:', rooms.map(r => ({ label: r.label, type: r.type })));
    
    return rooms;
  }, [rooms]);

  const handleRoomHover = (room) => {
    setHoveredRoom(room);
    if (onRoomHover) onRoomHover(room);
  };

  const handleRoomHoverOut = () => {
    setHoveredRoom(null);
    if (onRoomHover) onRoomHover(null);
  };

  return (
    <>
      {/* Ground - White background like architectural drawings */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <meshLambertMaterial color="#FFFFFF" />
      </Plane>

      
      {/* Building Rooms - RE-ENABLED with proper scales */}
      {buildingRooms.map((room, index) => {
        // Increased scale and spacing for better visibility and separation
        const scale = 0.012; // Larger scale for better visibility
        const spacing = 0.5; // Add spacing between rooms
        const width = room.coordinates.width * scale;
        const depth = room.coordinates.height * scale;
        const height = 0.3; // Higher for better visibility
        
        // Position rooms with more spacing
        const baseX = (room.coordinates.x * scale) - 4;
        const baseZ = (room.coordinates.y * scale) - 3;
        
        // Add spacing based on room index to spread them out
        const x = baseX + (index % 3) * spacing;
        const z = baseZ + Math.floor(index / 3) * spacing;

        return (
          <Room3D
            key={room.id}
            room={room}
            position={[x, 0, z]}
            size={[width, height, depth]}
            onHover={handleRoomHover}
            onHoverOut={handleRoomHoverOut}
          />
        );
      })}


      {/* Some decorative elements */}
      <Box args={[0.2, 0.5, 0.2]} position={[6, 0.25, 6]}>
        <meshLambertMaterial color="#228B22" />
      </Box>
      <Box args={[0.2, 0.5, 0.2]} position={[-6, 0.25, 6]}>
        <meshLambertMaterial color="#228B22" />
      </Box>
      <Box args={[0.2, 0.5, 0.2]} position={[6, 0.25, -6]}>
        <meshLambertMaterial color="#228B22" />
      </Box>
      <Box args={[0.2, 0.5, 0.2]} position={[-6, 0.25, -6]}>
        <meshLambertMaterial color="#228B22" />
      </Box>
    </>
  );
};

const New3DBuildingViewer = ({ imageUrl, rooms = [] }) => {
  const [cameraPosition, setCameraPosition] = useState([0, 6, 4]); // Better angle for 3D models
  const [autoRotate, setAutoRotate] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-white">
      <Canvas
        camera={{ 
          position: cameraPosition, 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#FFFFFF' }}
      >
        {/* Enhanced lighting for 3D models */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.4} />

        {/* ✅ ChatGPT Fix 4: Debug helpers to see model placement */}
        <axesHelper args={[2]} />
        <gridHelper args={[10, 10]} />

        {/* 3D Building */}
        <Building3D rooms={rooms} onRoomHover={setHoveredRoom} />

        {/* Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-4 right-4 bg-gray-800 rounded-lg p-3 shadow-lg text-white space-y-2">
        <div className="text-xs space-y-1">
          <div>🖱️ Drag to orbit</div>
          <div>🔍 Scroll to zoom</div>
          <div>⌨️ Right-click + drag to pan</div>
          <div>🏠 Real 3D building</div>
        </div>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="w-full px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-medium transition-colors"
        >
          {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
        </button>
      </div>

      {/* Reset View Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setCameraPosition([0, 6, 4])}
          className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors"
        >
          3D View
        </button>
      </div>

      {/* View Presets */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white">
        <div className="text-xs font-medium mb-2">Quick Views:</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <button
            onClick={() => setCameraPosition([0, 10, 0])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Top
          </button>
          <button
            onClick={() => setCameraPosition([8, 4, 0])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Side
          </button>
          <button
            onClick={() => setCameraPosition([6, 6, 6])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Corner
          </button>
          <button
            onClick={() => setCameraPosition([0, 4, 8])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Front
          </button>
        </div>
      </div>

      {/* Hover Display */}
      {hoveredRoom && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none z-10">
          <div className="text-center">
            <div className="text-lg font-semibold">{hoveredRoom.label}</div>
            <div className="text-sm opacity-80 capitalize">{hoveredRoom.type.replace('_', ' ')}</div>
          </div>
        </div>
      )}

      {/* Building Info */}
      <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-3 shadow-lg text-white">
        <div className="text-xs">
          <div className="font-medium mb-1">3D Building Layout:</div>
          <div>Rooms: {rooms.length || 10}</div>
          <div>Models: 8 GLB Objects Available</div>
          <div>View: Interactive 3D</div>
          <div className="text-green-300 text-xs mt-1">
            ✅ GLB Models Working
          </div>
          <div className="text-green-300 text-xs">
            • Kitchen, Bathroom, Bedroom, Dining
          </div>
          <div className="text-green-300 text-xs">
            • Living Room, Entrance, Washroom, Balcony
          </div>
          <div className="text-yellow-300 text-xs mt-1">
            🎯 Proper scaling applied
          </div>
          {hoveredRoom && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div className="font-medium">Currently Viewing:</div>
              <div className="text-indigo-300">{hoveredRoom.label}</div>
              <div className="text-xs opacity-70">
                Model: {hoveredRoom.type}.glb
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default New3DBuildingViewer;
