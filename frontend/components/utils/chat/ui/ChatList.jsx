"use client";
import { ScrollArea } from '@/components/ui/components/scroll-area';
import { ChatAvatar } from './ChatAvatar';
import { formatMessageTime } from '@/lib/mock';

export function ChatList({ users, activeChat, setActiveChat }) {
  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {users.map((user) => {
            const isActive = activeChat?.id === user.id;
            const lastMessage = user.lastMessage || { timestamp: user.lastSeen };
            const time = formatMessageTime(lastMessage.timestamp);
            
            return (
              <div
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted/60'
                }`}
              >
                <ChatAvatar user={user} showStatus={true} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{time}</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground truncate max-w-[140px]">
                    {user.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
