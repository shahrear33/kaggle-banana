"use client";
import { useState } from "react";
import { useClient } from "./AgoraSettings";
import { motion } from "framer-motion";
import { BsMic, BsMicMute, BsCameraVideoOff, BsCameraVideo, BsLayoutSplit } from 'react-icons/bs';
import { RxExit } from 'react-icons/rx';
import { FiSettings, FiShare, FiMessageSquare } from 'react-icons/fi';
import { MdOutlineScreenShare, MdStopScreenShare } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiRecordCircleLine, RiRecordCircleFill } from 'react-icons/ri';
import { useRouter } from "next/navigation";
import { Button } from "../ui/components/button";
// Tooltip imports removed to fix error
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/components/dropdown-menu";

export default function VideoControls(props) {
  const router = useRouter();
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState("grid");

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    router.back();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, you would start/stop actual recording here
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
    // In a real implementation, you would handle screen sharing via Agora SDK
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    // In a real implementation, this would open/close a chat panel
  };

  const changeLayout = () => {
    setLayoutMode(layoutMode === "grid" ? "speaker" : "grid");
    // In a real implementation, this would switch between different video layouts
  };

  // Animation variants for the control bar
  const controlVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        staggerChildren: 0.05,
        delayChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={controlVariants}
      className="flex flex-col w-full mt-8"
    >
      {/* Main control bar with primary actions - more compact */}
      <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 shadow-lg border border-border/10 flex justify-center items-center space-x-2">
        <motion.div variants={itemVariants}>
          <Button
            variant={trackState.audio ? "default" : "destructive"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => mute("audio")}
            aria-label={trackState.audio ? "Mute Microphone" : "Unmute Microphone"}
          >
            {trackState.audio ? <BsMic className="h-5 w-5" /> : <BsMicMute className="h-5 w-5" />}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant={trackState.video ? "default" : "destructive"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => mute("video")}
            aria-label={trackState.video ? "Turn Off Camera" : "Turn On Camera"}
          >
            {trackState.video ? <BsCameraVideo className="h-5 w-5" /> : <BsCameraVideoOff className="h-5 w-5" />}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant={isScreenSharing ? "destructive" : "outline"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={toggleScreenSharing}
            aria-label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
          >
            {isScreenSharing ? 
              <MdStopScreenShare className="h-5 w-5" /> : 
              <MdOutlineScreenShare className="h-5 w-5" />
            }
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? 
              <RiRecordCircleFill className="h-5 w-5 text-red" /> : 
              <RiRecordCircleLine className="h-5 w-5" />
            }
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12 rounded-full bg-red hover:bg-red/90"
            onClick={() => leaveChannel()}
            aria-label="Leave Call"
          >
            <RxExit className="h-5 w-5" />
          </Button>
        </motion.div>
        {/* Layout button integrated into primary controls */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={changeLayout}
            aria-label="Change Layout"
          >
            <BsLayoutSplit className="h-5 w-5" />
          </Button>
        </motion.div>
        
        {/* Settings menu integrated into primary controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <FiSettings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuLabel>Meeting Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FiMessageSquare className="mr-2 h-4 w-4" /> Chat Options
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FiShare className="mr-2 h-4 w-4" /> Share Meeting Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Audio Settings</DropdownMenuItem>
            <DropdownMenuItem>Video Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}