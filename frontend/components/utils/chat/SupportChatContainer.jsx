"use client"
import { useState } from "react";
import { ImCross } from 'react-icons/im'
import { BsFillSendFill } from 'react-icons/bs'
import Messages from "./Messages";

export default function SupportChatContainer({ setChatOpened }) {
  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState("")
  const id = Math.ceil(Math.random() * 100000000)
  const url = `https://api.openai.com/v1/chat/completions`
  async function handleSubmit(e) {
      const newMessage = { id, content: messageContent, owner: "owner" };
      setMessageContent("");
      setMessages(prevMessages => [...prevMessages, newMessage])
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: "You are a helpful AI assistant that provides accurate and concise answers."
                }
              ]
            },
            ...messages.map(msg => ({
              role: msg.owner === "owner" ? "user" : "assistant",
              content: [
                {
                  type: "text", 
                  text: msg.content
                }
              ]
            })),
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: messageContent
                }
              ]
            }
          ]
        })
      })
      if (response.ok) {
        let answer = await response.json()
        answer = answer.choices[0].message.content
        setMessages(prevMessages => [...prevMessages, {id, content: answer, owner: "ai"}])
      } else {
        console.error("Failed to send message");
      }
    }
  
  return (
    <main className="flex flex-col w-[26rem] shadow-2xl rounded-2xl h-[32rem] bg-white absolute bottom-0 right-0">
       <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-white items-center rounded-t-2xl">
            <div className="justify-between px-6 flex items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">AI Assistant</h3>
                        <p className="text-xs text-white/70">Always here to help</p>
                    </div>
                </div>
                <div onClick={() => setChatOpened(false)} className="text-xl cursor-pointer hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ImCross className="w-4 h-4" />
                </div>
            </div>
        </nav> 
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
        <Messages chatbot={true} messages={messages}/>
        <div className="w-full p-4 bg-white border-t">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
            <input 
              type="text" 
              value={messageContent} 
              onChange={e => setMessageContent(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none py-2 dark:text-[#000]"
            />
            <button 
              onClick={handleSubmit}
              className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white hover:opacity-90 transition-opacity"
            >
              <BsFillSendFill className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

