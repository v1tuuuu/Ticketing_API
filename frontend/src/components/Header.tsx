import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow transition-colors dark:bg-gray-900 dark:text-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            🎟️ Ticketing
          </Link>
          {isAuthenticated && (
            <div className="flex gap-6">
              <Link to="/events" className="text-gray-600 hover:text-primary transition dark:text-gray-300">
                Eventos
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/create-event" className="text-gray-600 hover:text-primary transition dark:text-gray-300">
                  Criar Evento
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600 dark:text-gray-300">Olá, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
              >
                Cadastro
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
