import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';

export const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, vacancies(title), profiles:job_seeker_id(full_name)')
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
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Barcha Arizalar</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-4">Nomzod</th>
              <th className="px-6 py-4">Vakansiya</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Sana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{app.profiles?.full_name}</td>
                <td className="px-6 py-4 text-gray-600">{app.vacancies?.title}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(app.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
