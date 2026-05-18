import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Briefcase 
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const ManageVacancies = () => {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVacancies = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .select('*, applications(count)')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

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
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham ushbu vakansiyani o‘chirmoqchimisiz?')) return;
    try {
      const { error } = await supabase.from('vacancies').delete().eq('id', id);
      if (error) throw error;
      setVacancies(vacancies.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi.');
    }
  };

  const filteredVacancies = vacancies.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Vakansiyalar Boshqaruvi</h1>
          <p className="text-gray-500">Siz tomondan yaratilgan barcha vakansiyalar</p>
        </div>
        <Link
          to="/employer/vacancies/create"
          className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Yangi vakansiya
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Vakansiya nomi bo‘yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <Loading className="py-20" />
        ) : filteredVacancies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Sarlavha</th>
                  <th className="px-6 py-4 text-center">Arizalar</th>
                  <th className="px-6 py-4">Holat</th>
                  <th className="px-6 py-4">Sana</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredVacancies.map((vacancy) => (
                  <tr key={vacancy.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{vacancy.title}</div>
                      <div className="text-xs text-gray-400">{vacancy.job_type}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                        {vacancy.applications?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={vacancy.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(vacancy.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/vacancies/${vacancy.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ko‘rish"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/employer/vacancies/edit/${vacancy.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Tahrirlash"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(vacancy.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="O‘chirish"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="Vakansiyalar topilmadi" 
            description="Hali bitta ham vakansiya yaratmagansiz. Yangi vakansiya qo‘shish uchun tugmani bosing."
            icon={Briefcase}
          />
        )}
      </div>
    </div>
  );
};
