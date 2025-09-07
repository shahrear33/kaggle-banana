"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

// Import chat components
import { chatUsers } from '@/lib/mock';
import { ChatList } from './ui/ChatList';
import { ChatConversation } from './ui/ChatConversation';
import { ChatEmptyState } from './ui/ChatEmptyState';

export default function ChatInbox() {
  // Initialize with the mock data directly - only one state for active chat
  const [activeChat, setActiveChat] = useState(chatUsers.length > 0 ? chatUsers[0] : null);
  
  // Simple animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-[calc(100vh-160px)] overflow-hidden rounded-xl border border-border shadow-lg bg-background"
    >
      {/* Chat List - fixed width for desktop view */}
      <div className="md:w-80 w-1/3 md:block">
        <ChatList 
          users={chatUsers} 
          activeChat={activeChat} 
          setActiveChat={setActiveChat} 
        />
      </div>
      
      {/* Chat Conversation - fixed display */}
      <div className="flex-1 md:block">
        {activeChat ? (
          <ChatConversation chatUser={activeChat} />
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </motion.div>
  );
}
