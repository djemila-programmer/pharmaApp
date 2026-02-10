import { useState } from 'react';
import { Pill, Lock, User } from 'lucide-react';
import axiosClient from "../utils/axiosClient";

interface LoginProps {
  onLogin: (username: string, role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock users for demo
  const users = [
    { username: 'admin', password: 'admin@123', name: 'Admin', role: 'Administrateur' },
  ];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axiosClient.post("/api/auth/login", {
      username,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);

      const name = response.data.user?.name || "Administrateur";
      const role = response.data.user?.role || "Administrateur";

      onLogin(name, role);
    } else {
      setError("Identifiants incorrects");
    }

  } catch (err: any) {
    console.error(err.response?.data || err.message);
    setError("Identifiants incorrects");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PharmacyStock</h1>
          <p className="text-gray-600 mt-2">Système de gestion de pharmacie</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" aria-live="assertive">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Se connecter
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 text-center">Comptes de démonstration:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold text-gray-700">Administrateur:</p>
                <p className="text-gray-600">Username: <span className="font-mono">admin</span></p>
                <p className="text-gray-600">Password: <span className="font-mono">admin@123</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2026 PharmacyStock. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}