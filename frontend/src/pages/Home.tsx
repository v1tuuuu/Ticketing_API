import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">🎟️ Ticketing API</h1>
          <p className="text-xl mb-8 opacity-90">
            Gerenciar seus eventos e vender ingressos nunca foi tão fácil
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/events"
                className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Ver Eventos
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Começar Agora
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition"
                >
                  Já tenho conta
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-gray-800 dark:text-gray-100">
              <div className="text-4xl mb-4">🎪</div>
              <h3 className="text-xl font-bold mb-4">Crie Eventos</h3>
              <p className="text-gray-600">
                Organize seus eventos de forma simples e rápida
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-gray-800 dark:text-gray-100">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-bold mb-4">Venda Ingressos</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Controle múltiplos lotes de ingressos com preços diferentes
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-gray-800 dark:text-gray-100">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Acompanhamento</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitore vendas em tempo real e gerencie seu inventário
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
