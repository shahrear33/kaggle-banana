"use client";
import { PenLine, MessageSquarePlus, Users } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MessageSquarePlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">No active conversation</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Select a conversation from the list to start chatting or get assistance with your learning and career journey.
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureCard 
          icon={<PenLine className="h-6 w-6" />}
          title="Career Guidance"
          description="Chat with advisors to get personalized career advice and job search strategies."
        />
        <FeatureCard 
          icon={<Users className="h-6 w-6" />}
          title="Study Groups"
          description="Join chat groups with fellow students to discuss coursework and share resources."
        />
        <FeatureCard 
          icon={<MessageSquarePlus className="h-6 w-6" />}
          title="Learning Support"
          description="Get help from instructors and teaching assistants for your course questions."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border p-4 text-center">
      <div className="mb-2 rounded-full bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
