import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, AlertCircle, Loader2, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'motion/react';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'job_seeker' as 'job_seeker' | 'employer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Yangi UUID generatsiya qilamiz
      const newUserId = crypto.randomUUID();

      // To'g'ridan-to'g'ri profiles jadvaliga yozamiz (Authsiz)
      const { data, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: newUserId,
            full_name: formData.fullName,
            phone: formData.phone,
            role: formData.role,
            email: formData.email,
            password: formData.password
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      // LocalStorage ga saqlaymiz va tizimga kiritamiz
      localStorage.setItem('mock_user_profile', JSON.stringify(data));
      window.location.href = '/dashboard'; // Tizimga muvaffaqiyatli kirdik
      
    } catch (err: any) {
      console.error("Ro'yxatdan o'tishda xatolik:", err);
      // Agar email bazada bor bo'lsa
      if (err.code === '23505') {
        setError("Bu elektron pochta (email) bazada mavjud! Iltimos, boshqa pochta ishlating yoki 'Kirish' orqali kiring.");
      } else {
        setError(err.message || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-xl bg-blue-600 p-3 text-white mb-4">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ro‘yxatdan o‘tish</h2>
          <p className="mt-2 text-sm text-gray-600">Platformaga a’zo bo‘ling va barcha imkoniyatlardan foydalaning</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Siz kimsiz?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'job_seeker' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'job_seeker'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200'
                  }`}
                >
                  <User className="h-6 w-6 mb-2" />
                  <span className="text-xs font-bold font-mono">Ish izlovchi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'employer' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'employer'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200'
                  }`}
                >
                  <Briefcase className="h-6 w-6 mb-2" />
                  <span className="text-xs font-bold font-mono uppercase">Ish beruvchi</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                F.I.SH
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Ism Familiya"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                Telefon raqam
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="+998"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email manzili
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Parol
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
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
              'Ro‘yxatdan o‘tish'
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
              Kirish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
