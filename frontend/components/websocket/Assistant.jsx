"use client"
import React, { useState } from 'react';

const ChatAssistant = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [userId, setUserId] = useState('');

  const connectWebSocket = () => {
    if (!name || !instructions || !userId) {
      alert('Please fill in all fields');
      return;
    }

    const ENDPOINT = process.env.NEXT_PUBLIC_WS

    const wsUrl = `${ENDPOINT}/ai/ws/assistant/${userId}?instructions=${encodeURIComponent(instructions)}&name=${encodeURIComponent(name)}`;

    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      setReceivedMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.send(message);
      setReceivedMessage()
    }
  };

  return (
    <div>
      <h1>WebSocket Assistant</h1>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Assistant Name"
        />
        <input
          type="text"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
        />
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <button onClick={connectWebSocket}>Connect</button>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Received Message:</h2>
        <p>{receivedMessage}</p>
      </div>
    </div>
  );
};

export default ChatAssistant;