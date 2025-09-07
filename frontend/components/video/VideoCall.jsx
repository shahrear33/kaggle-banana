"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from './AgoraSettings';
import VideoPlayer from './VideoPlayer';
import VideoControls from './VideoControls';
import { AiOutlineWifi } from 'react-icons/ai';
import { BsShieldLock } from 'react-icons/bs';

export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState('good'); // 'good', 'fair', 'poor'
  const [meetingInfo, setMeetingInfo] = useState({
    title: 'Educational Video Conference',
    secure: true,
    duration: '60 minutes',
    participantLimit: 12
  });
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      try {
        await client.join(config.appId, name, config.token, null);
        // Simulate checking connection quality
        const quality = ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)];
        setConnectionQuality(quality);
        setConnecting(false);
      } catch (error) {
        console.log("Error joining channel:", error);
        setConnecting(false);
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
        setConnecting(false);
      }
    }

    // Simulate occasional connection quality changes
    const connectionCheck = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance to change connection quality
        const newQuality = ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)];
        setConnectionQuality(newQuality);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(connectionCheck);
  }, [channelName, client, ready, tracks]);

  // Get connection quality indicator color
  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green';
      case 'fair': return 'text-yellow';
      case 'poor': return 'text-red';
      default: return 'text-muted-foreground';
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  // Loading animation variants
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className='flex flex-col w-full h-full flex-1 bg-gradient-to-b from-background to-background-2 overflow-hidden relative'
    >
      {/* Connection quality indicator - small and subtle */}
      <div className={`absolute top-2 left-2 z-10 flex items-center space-x-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full ${getConnectionColor()} text-xs`}>
        <AiOutlineWifi className='w-3 h-3' />
        <span className='capitalize'>{connectionQuality}</span>
      </div>

      {/* Controls area */}
      <div className={`transition-all duration-300 ${start ? 'mb-2' : 'mb-0'} z-10`}>
        {ready && tracks && (
          <VideoControls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </div>

      {/* Video display area - takes full remaining space */}
      <div className='flex-1 relative rounded-xl overflow-hidden bg-black/5'>
        {connecting ? (
          <motion.div 
            variants={loadingVariants}
            className='absolute inset-0 flex flex-col items-center justify-center bg-background/90'
          >
            <div className='w-16 h-16 border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/50 rounded-full animate-spin mb-4'></div>
            <p className='text-lg font-medium'>Connecting to call...</p>
            <p className='text-sm text-muted-foreground mt-2'>Setting up your audio and video</p>
          </motion.div>
        ) : (
          start && tracks && <VideoPlayer tracks={tracks} users={users} />
        )}

        {!start && !connecting && (
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <div className='w-24 h-24 rounded-full bg-primary-soft flex items-center justify-center mb-4'>
              <AiOutlineWifi className='w-12 h-12 text-primary' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Ready to Join</h3>
            <p className='text-muted-foreground text-center max-w-md mb-6'>Your audio and video are set up. Click the button below to enter the call.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-6 py-3 bg-primary hover:bg-primary-dark transition-colors rounded-lg text-white font-medium'
              onClick={() => setStart(true)}
            >
              Join Call Now
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}