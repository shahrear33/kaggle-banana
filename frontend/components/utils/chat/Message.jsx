"use client" 
import React from 'react'

export default function Message({ sender, messageContent, chatbot }) {
  const isOwner = sender === 'owner'
  
  return (
    <div className={`flex space-x-4 items-start p-4 ${isOwner ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
        ${isOwner ? 'bg-purple-600' : 'bg-indigo-600'}`}>
        {isOwner ? (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104c-.739.141-1.465.344-2.167.607a1.5 1.5 0 01-1.167 0 11.15 11.15 0 00-2.167-.607C3.375 3.005 2.5 3.5 2.5 4.375v1.875c0 .875.875 1.37 1.75 1.27.738-.14 1.464-.343 2.166-.606a1.5 1.5 0 011.167 0c.703.263 1.429.466 2.167.606.875.1 1.75-.395 1.75-1.27V4.375c0-.875-.875-1.37-1.75-1.271zM9 12l2 2 4-4" />
          </svg>
        )}
      </div>
      <div className={`max-w-[70%] ${isOwner ? 'bg-purple-600 text-white' : 'bg-white dark:text-[#000]'} 
        rounded-2xl px-4 py-2 shadow-sm`}>
        <p className="text-sm leading-relaxed">{messageContent}</p>
      </div>
    </div>
  )
}
