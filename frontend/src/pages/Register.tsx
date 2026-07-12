import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.register({ name, email, password });
      login(response.token, response.user);
      navigate('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md dark:bg-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8">Cadastro</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-300">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-300">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 dark:text-gray-400">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
