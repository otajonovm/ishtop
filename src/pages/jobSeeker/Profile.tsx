import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Save, User, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Profile = () => {
  const { profile, user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Ma‘lumotlarni yangilashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mening Profilim</h1>
        <p className="text-gray-500">Shaxsiy ma‘lumotlaringizni tahrirlang</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl shadow-inner uppercase">
              {formData.full_name?.charAt(0) || 'U'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email manzili</label>
              <div className="mt-1 relative opacity-60">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">F.I.SH</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                  placeholder="Ism Familiya"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Telefon raqam</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                  placeholder="+998"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex-1">
              {success && (
                <p className="text-sm font-semibold text-green-600 flex items-center">
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Muvaffaqiyatli saqlandi!
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Saqlash</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
