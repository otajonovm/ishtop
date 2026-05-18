import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Building2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { VacancyCard } from '../../components/VacancyCard';
import { Loading } from '../../components/Loading';
import { motion } from 'motion/react';

export const Home = () => {
  const [recentVacancies, setRecentVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ vacancies: 0, companies: 0, users: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: vacancies } = await supabase
          .from('vacancies')
          .select('*, companies(*)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(6);
        
        setRecentVacancies(vacancies || []);

        const [vCount, cCount, uCount] = await Promise.all([
          supabase.from('vacancies').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('companies').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          vacancies: vCount.count || 0,
          companies: cCount.count || 0,
          users: uCount.count || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-widest leading-none">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            O'zbekistonda №1 Ish Qidirish Tizimi
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-800 leading-[1.1]">
            Kelajagingizni <span className="text-blue-600">Bugun</span><br />Quring
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Minglab vakansiyalar, yuzlab kompaniyalar va sizning yagona orzuyingizdagi ish - hammasi bir joyda jamlangan.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <Link
              to="/vacancies"
              aria-label="Ish qidirish"
              className="w-full sm:w-auto rounded-xl bg-blue-600 text-white px-8 py-4 text-base font-extrabold shadow-xl shadow-blue-100 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
            >
              <span>Ish qidirish</span>
              <Search className="ml-1 h-5 w-5" aria-hidden="true" />
            </Link>

            <Link
              to="/register"
              aria-label="Ro'yxatdan o'tish"
              className="w-full sm:w-auto rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <span>Ro'yxatdan o'tish</span>
              <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Bento Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-sm hover:shadow-md transition-all group">
          <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="h-8 w-8" />
          </div>
          <h3 className="text-4xl font-black text-slate-800 mb-2">{stats.vacancies}</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Vakansiyalar</p>
        </div>
        <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[2rem] text-center shadow-xl shadow-slate-200 group">
          <div className="inline-flex p-4 rounded-2xl bg-slate-800 text-white mb-6 group-hover:scale-110 transition-transform">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-4xl font-black text-white mb-2">{stats.companies}</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Kompaniyalar</p>
        </div>
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-sm hover:shadow-md transition-all group">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-4xl font-black text-slate-800 mb-2">{stats.users}</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Foydalanuvchilar</p>
        </div>
      </section>

      {/* Recent Vacancies Section */}
      <section className="space-y-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 border-l-4 border-blue-600 pl-6 py-2">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Vakansiyalar</h2>
            <p className="text-slate-500 font-medium mt-1">Bugungi kunda eng mashhur ish o'rinlari</p>
          </div>
          <Link
            to="/vacancies"
            className="text-blue-600 font-black hover:text-blue-700 flex items-center group bg-blue-50 px-4 py-2 rounded-xl transition-all"
          >
            Barchasini ko'rish <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentVacancies.map((vacancy, idx) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <VacancyCard vacancy={vacancy} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      {/* Promotion Bento Section */}
      <section className="bg-blue-600 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Yangi mutaxassislarni qidiryapsizmi?</h2>
            <p className="text-blue-100 text-lg mb-10 opacity-90">
               Ish beruvchi sifatida ro'yxatdan o'ting va o'z kompaniyangiz uchun eng munosib nomzodlarni toping.
            </p>
            <Link to="/register" className="btn-primary bg-white text-blue-700 hover:bg-slate-50 py-4 px-10 text-lg shadow-none">
               Hoziroq boshlang
            </Link>
         </div>
         <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 opacity-10 rotate-12 hidden lg:block">
            <Building2 className="w-96 h-96" />
         </div>
      </section>
    </div>
  );
};
