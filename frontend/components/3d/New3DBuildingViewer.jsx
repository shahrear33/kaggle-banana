'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import { useState, useRef, useMemo } from 'react';
import * as THREE from 'three';

const Room3D = ({ room, position, size, onHover, onHoverOut }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Map room types to segment images
  const getImagePath = (roomType) => {
    const imageMap = {
      'living_room': '/segments/living.png',
      'kitchen': '/segments/dining.png', // Use dining as kitchen fallback
      'bedroom': '/segments/bedroom.png',
      'bathroom': '/segments/bathroom.png',
      'dining_room': '/segments/dining.png',
      'hallway': '/segments/entry.png',
      'master_bedroom': '/segments/master_bedroom.png',
      'laundry': '/segments/laundry.png',
      'entry': '/segments/entry.png',
      'default': '/segments/bedroom.png' // fallback
    };
    return imageMap[roomType] || imageMap.default;
  };

  // Load the texture for this room type
  const texture = useLoader(THREE.TextureLoader, getImagePath(room.type));
  
  // Configure texture to fit the room properly
  useMemo(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      texture.flipY = false;
    }
  }, [texture]);

  // Create realistic architectural furniture layout - flat top-down view
  const createRoomLayout = () => {
    const furniture = [];
    
    switch (room.type) {
      case 'kitchen':
        // L-shaped kitchen counters (very flat like architectural drawings)
        furniture.push(
          <Box key="counter-main" args={[size[0] * 0.85, 0.02, 0.6]} position={[0, 0.01, size[2] * 0.35]}>
            <meshLambertMaterial color="#D2B48C" />
          </Box>
        );
        furniture.push(
          <Box key="counter-side" args={[0.6, 0.02, size[2] * 0.5]} position={[size[0] * 0.3, 0.01, -size[2] * 0.1]}>
            <meshLambertMaterial color="#D2B48C" />
          </Box>
        );
        
        // Kitchen island
        furniture.push(
          <Box key="island" args={[1.2, 0.02, 0.7]} position={[-size[0] * 0.1, 0.01, -size[2] * 0.15]}>
            <meshLambertMaterial color="#A0522D" />
          </Box>
        );
        
        // Refrigerator (just a rectangle)
        furniture.push(
          <Box key="fridge" args={[0.6, 0.02, 0.6]} position={[size[0] * 0.3, 0.01, size[2] * 0.35]}>
            <meshLambertMaterial color="#C0C0C0" />
          </Box>
        );
        
        // Sink area
        furniture.push(
          <Box key="sink" args={[0.5, 0.02, 0.4]} position={[-size[0] * 0.2, 0.01, size[2] * 0.35]}>
            <meshLambertMaterial color="#B0C4DE" />
          </Box>
        );
        break;

      case 'living_room':
        // Large sectional sofa (L-shaped)
        furniture.push(
          <Box key="sofa-main" args={[2.2, 0.02, 0.8]} position={[0, 0.01, size[2] * 0.2]}>
            <meshLambertMaterial color="#696969" />
          </Box>
        );
        furniture.push(
          <Box key="sofa-corner" args={[0.8, 0.02, 1.4]} position={[size[0] * 0.2, 0.01, -size[2] * 0.15]}>
            <meshLambertMaterial color="#696969" />
          </Box>
        );
        
        // Coffee table (oval shape approximated with rounded rectangle)
        furniture.push(
          <Box key="coffee-table" args={[1.0, 0.015, 0.6]} position={[-size[0] * 0.1, 0.0075, -size[2] * 0.05]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        );
        
        // TV unit/entertainment center
        furniture.push(
          <Box key="tv-unit" args={[1.6, 0.02, 0.4]} position={[0, 0.01, -size[2] * 0.4]}>
            <meshLambertMaterial color="#2F2F2F" />
          </Box>
        );
        
        // Single armchair
        furniture.push(
          <Box key="armchair" args={[0.7, 0.02, 0.7]} position={[-size[0] * 0.35, 0.01, size[2] * 0.25]}>
            <meshLambertMaterial color="#8FBC8F" />
          </Box>
        );
        break;

      case 'bedroom':
        // Double/Queen bed (centered)
        furniture.push(
          <Box key="bed" args={[1.5, 0.02, 2.0]} position={[0, 0.01, 0]}>
            <meshLambertMaterial color="#F5F5DC" />
          </Box>
        );
        
        // Nightstands on both sides
        furniture.push(
          <Box key="nightstand-left" args={[0.4, 0.015, 0.4]} position={[-1.0, 0.0075, 0]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        );
        furniture.push(
          <Box key="nightstand-right" args={[0.4, 0.015, 0.4]} position={[1.0, 0.0075, 0]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        );
        
        // Wardrobe/closet along wall
        furniture.push(
          <Box key="wardrobe" args={[0.6, 0.02, 1.8]} position={[size[0] * 0.35, 0.01, size[2] * 0.15]}>
            <meshLambertMaterial color="#654321" />
          </Box>
        );
        
        // Dresser
        furniture.push(
          <Box key="dresser" args={[1.2, 0.015, 0.5]} position={[-size[0] * 0.25, 0.0075, size[2] * 0.35]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        );
        break;

      case 'bathroom':
        // Bathtub (standard size)
        furniture.push(
          <Box key="bathtub" args={[1.6, 0.015, 0.7]} position={[size[0] * 0.2, 0.0075, size[2] * 0.25]}>
            <meshLambertMaterial color="#F8F8FF" />
          </Box>
        );
        
        // Toilet
        furniture.push(
          <Box key="toilet" args={[0.4, 0.015, 0.6]} position={[size[0] * 0.25, 0.0075, -size[2] * 0.25]}>
            <meshLambertMaterial color="#F8F8FF" />
          </Box>
        );
        
        // Vanity with double sinks
        furniture.push(
          <Box key="vanity" args={[1.2, 0.015, 0.5]} position={[-size[0] * 0.15, 0.0075, -size[2] * 0.3]}>
            <meshLambertMaterial color="#D2B48C" />
          </Box>
        );
        
        // Shower enclosure
        furniture.push(
          <Box key="shower" args={[0.9, 0.01, 0.9]} position={[-size[0] * 0.25, 0.005, size[2] * 0.2]}>
            <meshLambertMaterial color="#E6E6FA" />
          </Box>
        );
        break;

      case 'dining_room':
        // Rectangular dining table
        furniture.push(
          <Box key="dining-table" args={[1.6, 0.015, 0.9]} position={[0, 0.0075, 0]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        );
        
        // 6 dining chairs arranged around table
        const chairPositions = [
          [-1.0, -0.6], [1.0, -0.6], // head and foot
          [-1.0, 0.6], [1.0, 0.6],   // head and foot  
          [0, -0.6], [0, 0.6]        // sides
        ];
        
        chairPositions.forEach((pos, i) => {
          furniture.push(
            <Box key={`chair-${i}`} args={[0.35, 0.015, 0.35]} position={[pos[0], 0.0075, pos[1]]}>
              <meshLambertMaterial color="#654321" />
            </Box>
          );
        });
        
        // Buffet/sideboard
        furniture.push(
          <Box key="buffet" args={[1.4, 0.015, 0.4]} position={[0, 0.0075, size[2] * 0.35]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        );
        break;

      case 'hallway':
        // Console table if space allows
        if (size[0] > 1.5) {
          furniture.push(
            <Box key="console" args={[0.8, 0.01, 0.3]} position={[0, 0.005, 0]}>
              <meshLambertMaterial color="#8B4513" />
            </Box>
          );
        }
        break;

      default:
        // Minimal furniture for unknown room types
        furniture.push(
          <Box key="generic-furniture" args={[0.6, 0.01, 0.6]} position={[0, 0.005, 0]}>
            <meshLambertMaterial color="#A0A0A0" />
          </Box>
        );
        break;
    }

    return furniture;
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
      {/* Floor with segment image texture */}
      <Plane
        ref={meshRef}
        args={[size[0], size[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshLambertMaterial 
          map={texture} 
          transparent 
          opacity={hovered ? 1.0 : 0.9}
        />
      </Plane>

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

      {/* Room Label - Visible from all angles */}
      <Text
        position={[0, 0.35, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {room.label}
      </Text>

      {/* Room Type Label */}
      <Text
        position={[0, 0.32, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        ({room.type.replace('_', ' ')})
      </Text>

      {/* Additional labels for side views */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {room.label}
      </Text>

      {/* Note: Using segment images instead of individual furniture pieces */}
    </group>
  );
};

const Building3D = ({ rooms, onRoomHover }) => {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const buildingRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      // Mock data with realistic room types for demonstration
      return [
        { id: 1, label: 'Living Room', type: 'living_room', coordinates: { x: 480, y: 120, width: 380, height: 280 } },
        { id: 2, label: 'Kitchen', type: 'kitchen', coordinates: { x: 250, y: 140, width: 220, height: 250 } },
        { id: 3, label: 'Dining Room', type: 'dining_room', coordinates: { x: 280, y: 380, width: 200, height: 160 } },
        { id: 4, label: 'Bedroom 1', type: 'bedroom', coordinates: { x: 400, y: 50, width: 170, height: 120 } },
        { id: 5, label: 'Bedroom 2', type: 'bedroom', coordinates: { x: 230, y: 50, width: 170, height: 120 } },
        { id: 6, label: 'Bathroom', type: 'bathroom', coordinates: { x: 100, y: 40, width: 150, height: 180 } },
        { id: 7, label: 'Hallway', type: 'hallway', coordinates: { x: 370, y: 170, width: 200, height: 100 } }
      ];
    }
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

      {/* Building Rooms */}
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
  const [cameraPosition, setCameraPosition] = useState([0, 8, 0]); // Top-down architectural view
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
        {/* Bright, even lighting for architectural clarity */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[0, 10, 0]} intensity={0.5} />

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
          onClick={() => setCameraPosition([0, 8, 0])}
          className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors"
        >
          Top View
        </button>
      </div>

      {/* View Presets */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white">
        <div className="text-xs font-medium mb-2">Quick Views:</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <button
            onClick={() => setCameraPosition([0, 8, 0])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Top
          </button>
          <button
            onClick={() => setCameraPosition([6, 4, 0])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Side
          </button>
          <button
            onClick={() => setCameraPosition([4, 6, 4])}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Corner
          </button>
          <button
            onClick={() => setCameraPosition([0, 4, 6])}
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
          <div className="font-medium mb-1">Building Layout:</div>
          <div>Rooms: {rooms.length || 7}</div>
          <div>Layout: Segment Images</div>
          {hoveredRoom && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div className="font-medium">Currently Viewing:</div>
              <div className="text-indigo-300">{hoveredRoom.label}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default New3DBuildingViewer;
