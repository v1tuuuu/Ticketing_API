import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EventCard } from '../components/EventCard';
import type { Event } from '../types/index';
import { apiService } from '../services/api';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { token } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const response = await apiService.getEvents(token);
        setEvents(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar eventos');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Eventos Disponíveis</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl dark:text-gray-300">Nenhum evento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
