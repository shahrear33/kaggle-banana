"use client"
import { useEffect, useRef } from 'react';
import Message from './Message';

export default function Messages({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="p-4 space-y-4">
      {messages.map(message => (
        <Message 
          key={message.id}
          sender={message.owner}
          messageContent={message.content}
          image={message.image}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 