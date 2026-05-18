import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Briefcase, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { DashboardCard } from '../../components/DashboardCard';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';
import { motion } from 'motion/react';

export const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const { data: apps, error } = await supabase
          .from('applications')
          .select('*, vacancies(*, companies(*))')
          .eq('job_seeker_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRecentApplications(apps.slice(0, 5));
        setStats({
          total: apps.length,
          pending: apps.filter(a => ['yangi', 'korib_chiqilmoqda'].includes(a.status)).length,
          accepted: apps.filter(a => a.status === 'qabul_qilindi').length,
          rejected: apps.filter(a => a.status === 'rad_etildi').length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Xayrli kun!</h1>
          <p className="text-sm text-slate-500">Mening arizalarim va statuslar statistikasi</p>
        </div>
        <Link
          to="/vacancies"
          className="btn-primary flex items-center gap-2"
        >
          Ish qidirish <Briefcase className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Arizalar" 
          value={stats.total} 
          icon={FileText} 
          color="blue" 
        />
        <DashboardCard 
          title="Kutilmoqda" 
          value={stats.pending} 
          icon={Clock} 
          color="amber" 
        />
        <DashboardCard 
          title="Qabul qilindi" 
          value={stats.accepted} 
          icon={CheckCircle2} 
          color="green" 
        />
        <DashboardCard 
          title="Rad etildi" 
          value={stats.rejected} 
          icon={XCircle} 
          color="red" 
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bento-card overflow-hidden flex flex-col min-h-[400px]">
           <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h3 className="font-bold text-lg text-slate-800">So'nggi arizalarim</h3>
            <Link to="/dashboard/applications" className="text-blue-600 text-sm font-semibold hover:underline">
              Barchasini ko'rish
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest sticky top-0">
                <tr>
                  <th className="px-8 py-4">Vakansiya</th>
                  <th className="px-4 py-4">Kompaniya</th>
                  <th className="px-4 py-4">Holat</th>
                  <th className="px-8 py-4 text-right">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-4">
                         <Link to={`/vacancies/${app.vacancy_id}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                           {app.vacancies?.title}
                         </Link>
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-medium">{app.vacancies?.companies?.name}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-8 py-4 text-right">
                         <span className="text-xs text-slate-400 font-medium">{formatDate(app.created_at)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">
                      Hozircha arizalar mavjud emas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white relative overflow-hidden h-64 flex flex-col justify-between shadow-xl shadow-indigo-100">
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-2">Profilni Boyditing</h4>
                <p className="text-indigo-100 text-xs leading-relaxed opacity-80">
                   Profil darajangiz qanchalik yuqori bo'lsa, ish beruvchilar sizga shunchalik tez e'tibor qaratadi.
                </p>
              </div>
              <div className="relative z-10">
                 <Link
                   to="/dashboard/profile"
                   className="btn-primary bg-white text-indigo-700 hover:bg-slate-50 shadow-none py-2 px-4"
                 >
                   Profilni ko'rish
                 </Link>
              </div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
           </div>

           <div className="bento-card p-6 flex flex-col justify-between">
              <h4 className="font-bold text-slate-800 mb-4">Arizalar natijasi</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-emerald-500">Qabul qilingan</span>
                    <span>{stats.accepted}</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.accepted / (stats.total || 1)) * 100}%` }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-red-400">Rad etilgan</span>
                    <span>{stats.rejected}</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.rejected / (stats.total || 1)) * 100}%` }}
                      className="bg-red-400 h-full rounded-full"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
