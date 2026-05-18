import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';

export const AdminVacancies = () => {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*, companies(name)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setVacancies(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Barcha Vakansiyalar</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-4">Vakansiya</th>
              <th className="px-6 py-4">Kompaniya</th>
              <th className="px-6 py-4">Holat</th>
              <th className="px-6 py-4">Sana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {vacancies.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{v.title}</td>
                <td className="px-6 py-4 text-gray-600">{v.companies?.name}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(v.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
