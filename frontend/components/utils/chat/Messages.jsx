"use client"
import React, { useEffect, useRef } from 'react'
import Message from './Message'

export default function Messages({ messages, chatbot }) {
  const chatBoxRef = useRef(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className='px-4 h-[22rem] overflow-y-scroll scrollbar-hidden' ref={chatBoxRef}>
      {
        messages.map(message => <Message chatbot={chatbot} sender={message?.owner} messageContent={message?.content} key={message?.id}/>)
      }
    </div>
  )
}
