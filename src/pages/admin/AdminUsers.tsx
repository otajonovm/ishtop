import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/Loading';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-4">F.I.SH</th>
              <th className="px-6 py-4">Roli</th>
              <th className="px-6 py-4">Telefon</th>
              <th className="px-6 py-4">Sana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{user.full_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.role === 'admin' ? 'bg-red-50 text-red-600' :
                    user.role === 'employer' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
