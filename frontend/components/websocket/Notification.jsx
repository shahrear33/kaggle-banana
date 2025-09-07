"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FaBell } from 'react-icons/fa';
import { Dot } from '../ui/components/status';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [ws, setWs] = useState(null);

  const WS_ENDPOINT = process.env.NEXT_PUBLIC_WS;
  const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${ENDPOINT}/notification/user/1`);
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const newWs = new WebSocket(`${WS_ENDPOINT}/notification/ws/1`);
    setWs(newWs);

    newWs.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [{ ...newNotification, is_read: false }, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (newWs) {
        newWs.close();
      }
      setWs(null);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      try {
        fetch(`${ENDPOINT}/notification/user/1`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }).then(() => {
          setUnreadCount(0);
          setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        });
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button className="relative p-2 hover:bg-gray-100 rounded-full" onClick={() => {
        setIsOpen(prev => !prev);
      }}>
        <FaBell className="text-gray-800"  />
        {unreadCount > 0 && (
          <span className="absolute top-0 h-4 w-4 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-[#a31919] bg-gray-100 p-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto scrollbar-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                    
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'numeric',
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        }).replace(',', ' .')}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <Dot variant='success' />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
