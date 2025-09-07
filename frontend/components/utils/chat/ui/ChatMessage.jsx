"use client";
import { formatMessageTime } from '@/lib/mock';
import { ChatAvatar } from './ChatAvatar';

export function ChatMessage({ message, isCurrentUser, showAvatar, chatUser, currentUser }) {
  // Simple static message rendering with minimal processing
  const sender = isCurrentUser ? currentUser : chatUser;
  const userName = message.userName || sender?.name || 'Unknown';
  const messageContent = message.content;
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for non-current user */}
      {!isCurrentUser && showAvatar && (
        <div className="mr-2 flex-shrink-0">
          <ChatAvatar user={sender} size="sm" showStatus={false} />
        </div>
      )}
      
      {/* Message content */}
      <div className={`max-w-[80%] ${!isCurrentUser && !showAvatar ? 'ml-8' : ''}`}>
        {!isCurrentUser && showAvatar && (
          <div className="text-xs text-muted-foreground mb-1 ml-1">{userName}</div>
        )}
        
        <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Message bubble */}
          <div 
            className={`rounded-2xl px-4 py-2 ${
              isCurrentUser 
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-card rounded-bl-sm'
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">
              {messageContent}
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </div>
        </div>
      </div>
      
      {/* Avatar for current user */}
      {isCurrentUser && showAvatar && (
        <div className="ml-2 flex-shrink-0">
          <ChatAvatar user={sender} size="sm" showStatus={false} />
        </div>
      )}
    </div>
  );
}
