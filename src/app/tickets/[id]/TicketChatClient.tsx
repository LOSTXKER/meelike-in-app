// src/app/tickets/[id]/TicketChatClient.tsx
"use client";

import React, { useState, useMemo } from 'react';
import PageBanner from '../../components/PageBanner';
import { Ticket, TicketMessage } from '../data';
import TicketDetailsCard from './TicketDetailsCard';

// --- Icons ---
const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-8.609 8.609a4.5 4.5 0 006.364 6.364l6.88-6.88a.75.75 0 011.06 1.06l-6.88 6.88a6 6 0 11-8.486-8.485l8.61-8.61a3.75 3.75 0 115.303 5.304l-6.88 6.88a2.25 2.25 0 01-3.182-3.182l8.61-8.61a.75.75 0 011.06 1.06l-8.61 8.61a.75.75 0 001.06 1.06l6.88-6.88a3.75 3.75 0 00-5.303-5.304l-8.61 8.61a5.25 5.25 0 007.424 7.424l8.609-8.609a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>;
const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>;


// --- Re-usable Components ---

const TicketStatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    Open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Closed: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    Answered: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };
  const className = `${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`;
  return <span className={className}>{status}</span>;
};

const ChatMessage = ({ message }: { message: TicketMessage }) => {
  const isUser = message.isUser;
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img src={message.avatar} alt={message.author} className="w-10 h-10 rounded-full flex-shrink-0" />
      )}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-xl p-4 rounded-2xl ${isUser ? 'bg-brand-primary text-white dark:bg-dark-primary dark:text-brand-text-dark' : 'bg-brand-secondary-light dark:bg-dark-surface'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        <span className="mt-2 text-xs text-brand-text-light dark:text-dark-text-light">
          {message.author} - {message.timestamp}
        </span>
      </div>
       {isUser && (
        <img src={message.avatar} alt={message.author} className="w-10 h-10 rounded-full flex-shrink-0" />
      )}
    </div>
  );
};

// --- Main Client Component ---

interface TicketChatClientProps {
  ticket: Ticket;
}

export default function TicketChatClient({ ticket: initialTicket }: TicketChatClientProps) {
  const [ticket, setTicket] = useState(initialTicket);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(ticket.messages);

  // The conversation should not include the very first message from the user,
  // as it's now displayed in the details card.
  const conversationMessages = useMemo(() => {
    const firstUserMessageIndex = messages.findIndex(m => m.isUser);
    if (firstUserMessageIndex !== -1) {
      return messages.slice(firstUserMessageIndex + 1);
    }
    return messages;
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: TicketMessage = {
      id: messages.length + 1,
      author: 'Saruth',
      avatar: 'https://placehold.co/100x100/FCD77F/473B30?text=S',
      text: newMessage,
      timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setTicket(prev => ({ ...prev, status: 'Open' })); // Re-open ticket on reply
  };

  const handleCloseTicket = () => {
    // In a real app, this would be an API call
    setTicket(prev => ({ ...prev, status: 'Closed' }));
  };

  return (
    <div className="space-y-6">
      <PageBanner title="Ticket Details" breadcrumbs={[{ label: 'Tickets', href: '/tickets' }, { label: `#${ticket.id}` }]} />

      <div className="bg-brand-surface dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg">
        {/* Ticket Header */}
        <div className="p-6 border-b border-brand-border dark:border-dark-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-brand-text-dark dark:text-dark-text-dark">{ticket.subject}</h2>
            <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <TicketStatusBadge status={ticket.status} />
                {ticket.status !== 'Closed' && (
                    <button 
                        onClick={handleCloseTicket}
                        className="flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                    >
                        <LockClosedIcon />
                        Close Ticket
                    </button>
                )}
            </div>
          </div>
          <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-2">
            Ticket ID: <span className="font-semibold text-brand-text-dark dark:text-dark-text-dark">{ticket.id}</span> | 
            Category: <span className="font-semibold text-brand-text-dark dark:text-dark-text-dark">{ticket.category}</span> | 
            Created: <span className="font-semibold text-brand-text-dark dark:text-dark-text-dark">{ticket.createdAt}</span>
          </p>
        </div>

        {/* Chat Area */}
        <div className="p-6 space-y-6 h-[600px] overflow-y-auto bg-brand-bg/50 dark:bg-dark-bg/50">
          <TicketDetailsCard ticket={ticket} />
          
          {/* Conversation */}
          {conversationMessages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>

        {/* Message Input */}
        {ticket.status !== 'Closed' ? (
            <div className="p-4 bg-brand-surface dark:bg-dark-surface border-t border-brand-border dark:border-dark-border">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 w-full px-4 py-3 bg-brand-secondary-light dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button
                  type="button"
                  className="p-3 text-brand-text-light dark:text-dark-text-light hover:text-brand-primary dark:hover:text-dark-primary hover:bg-brand-secondary-light dark:hover:bg-dark-surface rounded-full transition-colors"
                  onClick={() => alert('File upload UI not implemented yet.')}
                >
                  <PaperclipIcon />
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </div>
        ) : (
            <div className="p-6 text-center bg-gray-50 dark:bg-gray-800 border-t border-brand-border dark:border-dark-border rounded-b-lg">
                <h3 className="font-semibold text-gray-600 dark:text-gray-300">This ticket is closed.</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">To reopen it, please create a new ticket.</p>
            </div>
        )}
      </div>
    </div>
  );
}
