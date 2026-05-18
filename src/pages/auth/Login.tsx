import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'motion/react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // profiles jadvalidan email va parol orqali qidiramiz
      const { data, error: loginError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (loginError || !data) {
         throw new Error('Email yoki parol noto‘g‘ri kiritildi');
      }

      // LocalStorage ga saqlaymiz va tizimga kiritamiz
      localStorage.setItem('mock_user_profile', JSON.stringify(data));
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      setError(err.message || 'Tizimga kirishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-xl bg-blue-600 p-3 text-white mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Xush kelibsiz!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tizimga kirish uchun malumotlaringizni kiriting
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email manzili
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Parol
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                Parolni unutdingizmi?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Kirish'
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Hisobingiz yo‘qmi?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500">
              Ro‘yxatdan o‘tish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
