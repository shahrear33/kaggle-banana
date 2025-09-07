"use client";
import { Info } from 'lucide-react';
import { format } from 'date-fns';

import { ScrollArea } from '@/components/ui/components/scroll-area';

import { ChatAvatar } from './ChatAvatar';
import { ChatMessage } from './ChatMessage';
import { chatMessages } from '@/lib/mock';

export function ChatConversation({ chatUser }) {
  // Get messages for this user from mock data (or empty array if none found)
  const messagesData = chatUser ? (chatMessages[chatUser.id] || []) : [];
  
  // Group messages by date
  const groupedMessages = messagesData.reduce((groups, message) => {
    const date = format(new Date(message.timestamp), 'MMMM d, yyyy');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Simple function to determine if we should show avatar
  const shouldShowAvatar = (messages, idx) => {
    if (idx === 0) return true;
    return messages[idx].senderId !== messages[idx - 1].senderId;
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Simple chat header */}
      <div className="p-4 border-b border-border flex items-center">
        <ChatAvatar user={chatUser} animate={false} />
        <div className="ml-3">
          <div className="font-medium">{chatUser?.name}</div>
          <div className="text-xs text-muted-foreground">{chatUser?.role}</div>
        </div>
      </div>
      
      {/* Chat messages - static display only */}
      <ScrollArea className="flex-1 p-4">
        <div>
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="text-center my-4">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  {date}
                </span>
              </div>
              
              {dateMessages.map((message, idx) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === 'currentUser'}
                  showAvatar={shouldShowAvatar(dateMessages, idx)}
                  chatUser={chatUser}
                  currentUser={{ id: 'currentUser', name: 'You' }}
                  isLast={idx === dateMessages.length - 1}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Static input field - display only, no functionality */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-muted/40 p-3 w-full text-muted-foreground text-sm">
            Type a message... (Display only)
          </div>
        </div>
      </div>
    </div>
  );
}
