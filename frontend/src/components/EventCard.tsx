import type { Event } from '../types/index';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const totalTickets = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const soldTickets = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
      
      {event.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
      )}

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>📅 {formattedDate}</p>
        <p>📍 {event.location}</p>
        <p>👤 Organizador: {event.organizer.name}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Ingressos vendidos</span>
          <span className="font-semibold">{soldTickets}/{totalTickets}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to={`/events/${event.id}`}
          className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}
