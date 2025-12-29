// src/app/tickets/[id]/page.tsx
import React from 'react';
import { dummyTickets, Ticket } from '../data';
import TicketChatClient from './TicketChatClient';

// This function runs at build time on the server
export async function generateStaticParams() {
  return dummyTickets.map((ticket) => ({
    id: ticket.id,
  }));
}

const getTicketById = (id: string): Ticket | undefined => {
  return dummyTickets.find((ticket) => ticket.id === id);
};

// This is the main Page component (Server Component)
export default function TicketChatPage({ params }: { params: { id: string } }) {
  const ticket = getTicketById(params.id);

  if (!ticket) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Ticket not found</h1>
        <p>The ticket with ID "{params.id}" could not be found.</p>
      </div>
    );
  }

  // Render the Client Component and pass the ticket data as a prop
  return <TicketChatClient ticket={ticket} />;
}
