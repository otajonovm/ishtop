import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { VacancyCard } from '../../components/VacancyCard';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export const Vacancies = () => {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
  });

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('vacancies')
        .select('*, companies(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.type) {
        query = query.eq('job_type', filters.type);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVacancies(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVacancies();
  };

  return (
    <div className="space-y-12 py-6">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-black uppercase tracking-widest leading-none">
          Explore opportunities
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Vakansiyalar Ro‘yxati</h1>
        <p className="text-slate-500 font-medium">O‘zingizga mos ishni qidirish tizimi va filtrlar yordamida tez toping</p>
      </div>

      {/* Bento Filter Section */}
      <div className="bento-card p-6 shadow-md bg-white/80 backdrop-blur-md sticky top-20 z-30 border-blue-100/50">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Kasb yoki lavozim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
            />
          </div>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Shahar yoki hudud..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-slate-700"
            />
          </div>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full pl-12 pr-10 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all appearance-none font-medium text-slate-700"
            >
              <option value="">Ish turi (Hammasi)</option>
              <option value="full_time">To‘liq kun</option>
              <option value="part_time">Yarim stavka</option>
              <option value="remote">Masofaviy</option>
              <option value="contract">Shartnoma</option>
              <option value="internship">Amaliyot</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
               <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary py-3 flex items-center justify-center gap-2 group shadow-xl shadow-blue-100"
          >
            <Search className="h-4 w-4 group-hover:scale-110 transition-transform" /> Qidirish
          </button>
        </form>
      </div>

      {loading ? (
        <Loading className="py-20" />
      ) : vacancies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vacancies.map((vacancy, idx) => (
             <motion.div
               key={vacancy.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
             >
               <VacancyCard vacancy={vacancy} />
             </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20">
          <EmptyState 
            title="Vakansiyalar topilmadi" 
            description="Qidiruv shartlarini o‘zgartirib ko‘ring yoki keyinroq qaytib keling."
          />
        </div>
      )}
    </div>
  );
};
