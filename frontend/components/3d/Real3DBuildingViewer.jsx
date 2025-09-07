'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Real3DBuildingViewer = ({ imageUrl, rooms = [] }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!imageUrl || !mountRef.current) return;

    let scene, camera, renderer;
    let animationId;

    const initThreeJS = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
          throw new Error('Three.js not loaded');
        }

        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // Camera setup
        camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        cameraRef.current = camera;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        rendererRef.current = renderer;

        mountRef.current.appendChild(renderer.domElement);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // Create simple 3D building
        create3DBuilding(scene, rooms);

        // Simple orbit controls
        let isMouseDown = false;
        let mouseX = 0, mouseY = 0;
        let targetRotationX = 0, targetRotationY = 0;
        let rotationX = 0, rotationY = 0;

        const handleMouseDown = (event) => {
          isMouseDown = true;
          mouseX = event.clientX;
          mouseY = event.clientY;
        };

        const handleMouseMove = (event) => {
          if (!isMouseDown) return;
          
          const deltaX = event.clientX - mouseX;
          const deltaY = event.clientY - mouseY;
          
          targetRotationY += deltaX * 0.01;
          targetRotationX += deltaY * 0.01;
          
          mouseX = event.clientX;
          mouseY = event.clientY;
        };

        const handleMouseUp = () => {
          isMouseDown = false;
        };

        const handleWheel = (event) => {
          event.preventDefault();
          camera.position.z += event.deltaY * 0.01;
          camera.position.z = Math.max(3, Math.min(20, camera.position.z));
        };

        if (mountRef.current) {
          mountRef.current.addEventListener('mousedown', handleMouseDown);
          mountRef.current.addEventListener('mousemove', handleMouseMove);
          mountRef.current.addEventListener('mouseup', handleMouseUp);
          mountRef.current.addEventListener('wheel', handleWheel);
        }

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          
          // Smooth rotation
          rotationX += (targetRotationX - rotationX) * 0.1;
          rotationY += (targetRotationY - rotationY) * 0.1;
          
          scene.rotation.x = rotationX;
          scene.rotation.y = rotationY;
          
          renderer.render(scene, camera);
        };
        animate();

        setIsInitialized(true);
        setIsLoading(false);

      } catch (err) {
        console.error('Error initializing 3D viewer:', err);
        setError('Three.js not available. Using fallback.');
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure proper initialization
    const timer = setTimeout(initThreeJS, 100);

    return () => {
      clearTimeout(timer);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current && renderer && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // Ignore if already removed
        }
      }
      if (renderer) {
        renderer.dispose();
      }
    };

    // Handle resize
    const handleResize = () => {
      if (camera && renderer && mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [imageUrl, rooms]);

  const create3DBuilding = (scene, rooms) => {
    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Create building structure based on rooms
    const buildingGroup = new THREE.Group();
    
    // Create walls for each room
    if (rooms && rooms.length > 0) {
      rooms.forEach((room, index) => {
        const roomGroup = createRoom3D(room, index);
        buildingGroup.add(roomGroup);
      });
    } else {
      // Create a default building if no rooms
      const defaultRoom = {
        id: 'default',
        label: 'Building',
        type: 'living_room',
        coordinates: { x: 0, y: 0, width: 800, height: 600 }
      };
      const roomGroup = createRoom3D(defaultRoom, 0);
      buildingGroup.add(roomGroup);
    }

    buildingGroup.position.y = 0.1;
    scene.add(buildingGroup);

    // Add roof
    const roofGeometry = new THREE.BoxGeometry(18, 0.5, 18);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3;
    scene.add(roof);

    // Add some furniture/objects
    addFurniture(scene);
  };

  const createRoom3D = (room, index) => {
    const roomGroup = new THREE.Group();
    
    // Room dimensions (scaled down for 3D)
    const width = (room.coordinates.width / 100) * 2;
    const height = 2.5;
    const depth = (room.coordinates.height / 100) * 2;
    
    // Position based on coordinates
    const x = (room.coordinates.x / 100) * 2 - 8;
    const z = (room.coordinates.y / 100) * 2 - 8;

    // Create room walls
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: getRoomColor(room.type),
      transparent: true,
      opacity: 0.8
    });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(width, depth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xf5f5f5,
      transparent: true,
      opacity: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Walls
    const wallThickness = 0.1;
    
    // Front wall
    const frontWallGeometry = new THREE.BoxGeometry(width, height, wallThickness);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, height/2, depth/2);
    frontWall.castShadow = true;
    roomGroup.add(frontWall);

    // Back wall
    const backWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    backWall.position.set(0, height/2, -depth/2);
    backWall.castShadow = true;
    roomGroup.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(wallThickness, height, depth);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-width/2, height/2, 0);
    leftWall.castShadow = true;
    roomGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(width/2, height/2, 0);
    rightWall.castShadow = true;
    roomGroup.add(rightWall);

    // Position the room
    roomGroup.position.set(x, 0, z);

    // Add room label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, 256, 64);
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillText(room.label, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, height + 0.5, 0);
    roomGroup.add(label);

    return roomGroup;
  };

  const getRoomColor = (roomType) => {
    const colors = {
      'living_room': 0x87CEEB,
      'kitchen': 0xFFE4B5,
      'bedroom': 0xDDA0DD,
      'bathroom': 0xF0E68C,
      'dining_room': 0x98FB98,
      'hallway': 0xD3D3D3,
      'default': 0xE6E6FA
    };
    return colors[roomType] || colors.default;
  };

  const addFurniture = (scene) => {
    // Add some basic furniture to make it more realistic
    const furnitureGroup = new THREE.Group();

    // Add a few boxes as furniture
    for (let i = 0; i < 5; i++) {
      const furnitureGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.5);
      const furnitureMaterial = new THREE.MeshLambertMaterial({ 
        color: Math.random() * 0xffffff 
      });
      const furniture = new THREE.Mesh(furnitureGeometry, furnitureMaterial);
      furniture.position.set(
        (Math.random() - 0.5) * 15,
        0.4,
        (Math.random() - 0.5) * 15
      );
      furniture.castShadow = true;
      furnitureGroup.add(furniture);
    }

    scene.add(furnitureGroup);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Building 3D structure...</p>
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
        ref={mountRef} 
        className="w-full h-[500px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative bg-gradient-to-br from-gray-900 to-gray-800"
        style={{ touchAction: 'none' }}
      />
      
      {/* 3D Controls overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white pointer-events-none">
        <div className="text-xs space-y-1">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>🏠 Real 3D building</div>
        </div>
      </div>

      {/* Reset button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 5, 10);
              cameraRef.current.lookAt(0, 0, 0);
            }
            if (sceneRef.current) {
              sceneRef.current.rotation.set(0, 0, 0);
            }
          }}
          className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-black/90 transition-colors pointer-events-auto"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default Real3DBuildingViewer;
