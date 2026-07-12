export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  organizer: User;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: Event;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
