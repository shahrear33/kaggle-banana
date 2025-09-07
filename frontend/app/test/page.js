"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/components/table";
import { chatUsers } from "@/lib/mock";

export default function UserList() {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-8 px-6 w-full h-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User List</h1>
      
      <Table>
        <TableCaption>A list of platform users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={user.avatar || "/avatars/placeholder.png"} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${user.status === 'online' ? 'bg-green' : 'bg-red'}`}></span>
                </div>
                {user.name}
                {user.isGroup && (
                  <span className="text-xs bg-primary-light text-primary-dark px-2 py-1 rounded-full">
                    Group ({user.members})
                  </span>
                )}
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'online' ? 'bg-green-soft text-green-dark' : 'bg-red-100 text-red'}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(user.lastSeen)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button className="p-2 rounded-md hover:bg-primary-light text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="p-2 rounded-md hover:bg-red-100 text-red transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
