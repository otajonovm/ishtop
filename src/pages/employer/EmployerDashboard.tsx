import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  FileText, 
  Users, 
  Plus, 
  Clock, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { DashboardCard } from '../../components/DashboardCard';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';
import { motion } from 'motion/react';

export const EmployerDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    vacancies: 0,
    applications: 0,
    newApplications: 0,
    activeVacancies: 0,
  });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const [vResp, aResp] = await Promise.all([
          supabase.from('vacancies').select('*').eq('employer_id', user.id),
          supabase.from('applications').select('*, profiles(full_name), vacancies(title)').eq('employer_id', user.id).order('created_at', { ascending: false }),
        ]);

        const vacancies = vResp.data || [];
        const applications = aResp.data || [];

        setRecentApps(applications.slice(0, 5));
        setStats({
          vacancies: vacancies.length,
          applications: applications.length,
          newApplications: applications.filter(a => a.status === 'yangi').length,
          activeVacancies: vacancies.filter(v => v.status === 'active').length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Xush kelibsiz, {profile?.full_name?.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-500">Bugungi ko'rsatkichlar va arizalar bilan tanishing</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/employer/vacancies/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Yangi Vakansiya
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Vakansiyalar" 
          value={stats.vacancies} 
          icon={Briefcase} 
          color="blue" 
        />
        <DashboardCard 
          title="Arizalar" 
          value={stats.applications} 
          icon={FileText} 
          color="amber" 
        />
        <DashboardCard 
          title="Faol" 
          value={stats.activeVacancies} 
          icon={TrendingUp} 
          color="green" 
        />
        <DashboardCard 
          title="Yangi" 
          value={stats.newApplications} 
          icon={Clock} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Recent Applications Bento Section */}
        <div className="col-span-12 lg:col-span-8 bento-card overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h3 className="font-bold text-lg text-slate-800">So'nggi kelib tushgan arizalar</h3>
            <Link to="/employer/applications" className="text-blue-600 text-sm font-semibold hover:underline">
              Barchasini ko'rish
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest sticky top-0">
                <tr>
                  <th className="px-8 py-4">Nomzod</th>
                  <th className="px-4 py-4">Vakansiya</th>
                  <th className="px-4 py-4">Holat</th>
                  <th className="px-8 py-4 text-right">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentApps.length > 0 ? (
                  recentApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-110 transition-transform">
                            {app.profiles?.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{app.profiles?.full_name}</p>
                            <p className="text-[10px] text-slate-400 italic">Nomzod</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-slate-600">{app.vacancies?.title}</span>
                      </td>
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

        {/* Side Cards Bento Section */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden h-64 flex flex-col justify-between shadow-xl shadow-blue-100 group">
            <div className="relative z-10 transition-transform group-hover:translate-x-1">
              <h4 className="text-2xl font-bold mb-2">Statistika Hisoboti</h4>
              <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                Kompaniya profilini yakunlang. Ish izlovchilar siz haqizda ko‘proq ma‘lumotga ega bo‘lishsa, ishonch ortadi.
              </p>
            </div>
            <div className="relative z-10 mt-4 flex items-center justify-between">
              <Link
                to="/employer/company"
                className="inline-flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-xs font-bold text-white hover:bg-white/30 transition-all border border-white/20"
              >
                Tahrirlash <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-400/50 backdrop-blur-sm"></div>
                ))}
              </div>
            </div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
          </div>

          <div className="bento-card p-6 shadow-sm group">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-blue-600" />
               Vakansiya holati
            </h4>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div> 
                    Active
                  </div>
                  <span className="text-slate-800">{stats.activeVacancies}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activeVacancies / (stats.vacancies || 1)) * 100}%` }}
                    className="bg-blue-600 h-full rounded-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div> 
                    Yopilgan
                  </div>
                  <span className="text-slate-400">{stats.vacancies - stats.activeVacancies}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((stats.vacancies - stats.activeVacancies) / (stats.vacancies || 1)) * 100}%` }}
                    className="bg-slate-300 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              So'nggi 30 kunlik statistika
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
