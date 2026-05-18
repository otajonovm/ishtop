import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { FileText, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const UserApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, vacancies(*, companies(*))')
          .eq('job_seeker_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mening Arizalarim</h1>
        <p className="text-gray-500">Siz tomoningizdan yuborilgan barcha arizalar ro‘yxati</p>
      </div>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{app.vacancies?.title}</h3>
                  <p className="text-sm font-medium text-gray-500">{app.vacancies?.companies?.name}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" /> {formatDate(app.created_at)}
                    </span>
                    <span>ID: {app.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="flex flex-col items-end">
                  <StatusBadge status={app.status} />
                  <p className="mt-1 text-[10px] text-gray-400 uppercase font-bold tracking-widest whitespace-nowrap">Hozirgi status</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-8 w-px bg-gray-100 hidden md:block"></span>
                  <a
                    href={`/vacancies/${app.vacancy_id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Vakansiyani ko‘rish"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Arizalar topilmadi" 
          description="Siz hali birorta ham vakansiyaga ariza yubormagansiz."
          icon={FileText}
        />
      )}
    </div>
  );
};
