"use client"
import Image from 'next/image'
import { useState } from 'react'
import SupportChatContainer from './SupportChatContainer'

export default function SupportChat() {
    const [chatOpened, setChatOpened] = useState(false)
    
    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {!chatOpened && 
            <div 
                className='flex items-center gap-4 cursor-pointer transform hover:scale-105 transition-transform'
                onClick={() => setChatOpened(true)}
            >
                <div className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg 
                    px-4 py-3 rounded-2xl'>
                    Need help? Chat with AI 👋
                </div>
                <div className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 
                    flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
            </div>
            }
            {chatOpened && <SupportChatContainer setChatOpened={setChatOpened}/>}
        </div>
    )
}
