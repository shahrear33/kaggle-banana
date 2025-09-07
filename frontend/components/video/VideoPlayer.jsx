"use client"
import { AgoraVideoPlayer } from "agora-rtc-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar } from "../ui/components/avatar";
import { AiOutlineUser } from "react-icons/ai";
import { BsRecordCircle } from "react-icons/bs";

export default function VideoPlayer(props) {
  const { users, tracks } = props;
  const [isRecording, setIsRecording] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [activeTime, setActiveTime] = useState(0);

  // Simulated data for demo
  useEffect(() => {
    // Generate random user data for demo
    const mockUsers = [
      { id: 1, name: "John Doe", avatar: null },
      { id: 2, name: "Jane Smith", avatar: null },
      // More users can be added here
    ];
    setConnectedUsers(mockUsers);
    
    // Simulate timer for call duration
    const timer = setInterval(() => {
      setActiveTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time to display as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full h-full flex-1">
      {/* Timer display - minimal and unobtrusive */}
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
        <BsRecordCircle className={`${isRecording ? 'text-red animate-pulse' : 'text-white/70'} w-3 h-3`} />
        <span>{formatTime(activeTime)}</span>
      </div>

      {/* Main video layout - side by side with flex direction row */}
      <div className="flex h-full min-h-[calc(100vh-140px)] w-full gap-2">
        {/* Host video */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex-1 min-w-0 min-h-[calc(100vh-220px)] bg-black rounded-lg overflow-hidden shadow-xl border border-border/30"
        >
          <AgoraVideoPlayer
            videoTrack={tracks[1]}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm">
            You (Host)
          </div>
        </motion.div>

        {/* Participants videos in grid - right side panel */}
        <div className="w-1/3 min-w-[300px] flex flex-col gap-2 h-full min-h-[calc(100vh-140px)] overflow-y-auto">
          {users.length > 0 ? (
            users.map((user, index) => {
              if (user.videoTrack) {
                return (
                  <motion.div 
                    key={user.uid}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative w-full h-[220px] min-h-[220px] bg-black rounded-lg overflow-hidden shadow-md border border-border/30"
                  >
                    <AgoraVideoPlayer
                      videoTrack={user.videoTrack}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs">
                      Participant {index + 1}
                    </div>
                  </motion.div>
                );
              } else return null;
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full aspect-video flex flex-col items-center justify-center p-4 bg-muted/20 border border-dashed border-muted rounded-lg text-muted-foreground"
            >
              <AiOutlineUser className="w-6 h-6 mb-2 opacity-70" />
              <p className="text-xs text-center">Waiting for participants...</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}