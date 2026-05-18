import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/Loading';
import { DashboardCard } from '../../components/DashboardCard';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  XCircle,
  UserCheck,
  BriefcaseBusiness
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    employers: 0,
    jobSeekers: 0,
    companies: 0,
    vacancies: 0,
    applications: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          uCount,
          eCount,
          jsCount,
          cCount,
          vCount,
          aCount,
          accCount,
          rejCount
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'job_seeker'),
          supabase.from('companies').select('*', { count: 'exact', head: true }),
          supabase.from('vacancies').select('*', { count: 'exact', head: true }),
          supabase.from('applications').select('*', { count: 'exact', head: true }),
          supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'qabul_qilindi'),
          supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rad_etildi'),
        ]);

        setStats({
          users: uCount.count || 0,
          employers: eCount.count || 0,
          jobSeekers: jsCount.count || 0,
          companies: cCount.count || 0,
          vacancies: vCount.count || 0,
          applications: aCount.count || 0,
          accepted: accCount.count || 0,
          rejected: rejCount.count || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Tizim bo‘yicha umumiy statistika va nazorat</p>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Foydalanuvchilar" value={stats.users} icon={Users} color="blue" />
        <DashboardCard title="Kompaniyalar" value={stats.companies} icon={Building2} color="green" />
        <DashboardCard title="Vakansiyalar" value={stats.vacancies} icon={Briefcase} color="amber" />
        <DashboardCard title="Arizalar" value={stats.applications} icon={FileText} color="purple" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bento-card p-8 flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-indigo-900 text-white relative overflow-hidden shadow-xl shadow-indigo-100 min-h-[240px]">
           <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Tizim salomatligi: Alo darajada</h2>
              <p className="text-indigo-100 text-sm max-w-md leading-relaxed opacity-90">
                Barcha xizmatlar stabil ishlamoqda. {stats.vacancies} faol vakansiya va {stats.applications} jami ariza tizimda mavjud.
              </p>
           </div>
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute top-10 right-10 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Live Services</span>
           </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 bento-card p-6 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Natijalar
           </h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                 <span className="text-sm font-bold text-emerald-700">Qabul qilingan</span>
                 <span className="text-xl font-black text-emerald-800">{stats.accepted}</span>
              </div>
              <div className="flex justify-between items-center bg-red-50 p-3 rounded-2xl border border-red-100">
                 <span className="text-sm font-bold text-red-700">Rad etilgan</span>
                 <span className="text-xl font-black text-red-800">{stats.rejected}</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6 lg:col-span-3 bento-card p-6 shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ish beruvchilar</p>
           <h4 className="text-2xl font-black text-slate-800">{stats.employers}</h4>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-600">
              <Users className="h-3 w-3" /> 
              <span>Faol subyektlar</span>
           </div>
        </div>
        <div className="col-span-6 lg:col-span-3 bento-card p-6 shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ish izlovchilar</p>
           <h4 className="text-2xl font-black text-slate-800">{stats.jobSeekers}</h4>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-600">
              <UserCheck className="h-3 w-3" /> 
              <span>Potensial nomzodlar</span>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-6 bento-card p-6 shadow-sm flex items-center justify-between">
           <div>
              <h4 className="font-bold text-slate-800">Tezkor boshqaruv</h4>
              <p className="text-xs text-slate-400">Foydalanuvchi va kompaniyalarni tekshirish</p>
           </div>
           <div className="flex gap-2">
              <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                 <Users className="h-5 w-5 text-slate-600" />
              </button>
              <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                 <Building2 className="h-5 w-5 text-slate-600" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
