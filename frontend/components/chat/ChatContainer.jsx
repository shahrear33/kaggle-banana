"use client"
import { useState, useRef } from "react";
import { BsFillSendFill } from 'react-icons/bs';
import { FaImage } from 'react-icons/fa';
import Messages from "./Messages";

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const id = Math.ceil(Math.random() * 100000000);
  const url = `https://api.openai.com/v1/chat/completions`;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          file: file,
          preview: reader.result,
          base64: reader.result.split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSubmit() {
    if (!messageContent.trim() && !selectedImage) return;

    // Create the message to display in chat
    const newMessage = {
      id,
      content: messageContent,
      image: selectedImage?.preview,
      owner: "owner"
    };

    // Add message to chat immediately
    setMessageContent("");
    setMessages(prevMessages => [...prevMessages, newMessage]);

    try {
      // Prepare the message content for API
      let apiMessageContent = [];
      
      // Add text content if exists
      if (newMessage.content.trim()) {
        apiMessageContent.push({
          type: "text",
          text: newMessage.content
        });
      }

      // Add image content if exists
      if (selectedImage) {
        apiMessageContent.push({
          type: "image_url",
          image_url: {
            url: selectedImage.preview
          }
        });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant that provides accurate and concise answers."
            },
            ...messages.map(msg => ({
              role: msg.owner === "owner" ? "user" : "assistant",
              content: msg.image 
                ? [
                    { type: "text", text: msg.content || "" },
                    { 
                      type: "image_url",
                      image_url: {
                        url: msg.image
                      }
                    }
                  ]
                : msg.content
            })),
            {
              role: "user",
              content: apiMessageContent
            }
          ],
          max_tokens: 300
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const answer = data.choices[0].message.content;
        setMessages(prevMessages => [...prevMessages, {
          id: Math.ceil(Math.random() * 100000000),
          content: answer,
          owner: "ai"
        }]);
      } else {
        console.error("Failed to send message:", data.error?.message || "Unknown error");
      }

      // Clean up
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] scrollbar-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
        <h1 className="text-2xl font-bold text-white">AI Chat Assistant</h1>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex-1 overflow-y-auto">
          <Messages messages={messages} />
        </div>

        {selectedImage && (
          <div className="px-4 py-2 bg-slate-800">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img 
                  src={selectedImage.preview} 
                  alt="Selected" 
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  onClick={removeSelectedImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-800">
          <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-4 py-2">
            <input 
              type="text" 
              value={messageContent} 
              onChange={e => setMessageContent(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none py-2"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={handleImageClick}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Add image"
            >
              <FaImage className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSubmit}
              className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white hover:opacity-90 transition-opacity"
            >
              <BsFillSendFill className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 