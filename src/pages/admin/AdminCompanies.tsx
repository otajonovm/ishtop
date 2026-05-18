import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/Loading';
import { Building2, MapPin, Globe } from 'lucide-react';

export const AdminCompanies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCompanies(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Barcha Kompaniyalar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{company.name}</h3>
                <p className="text-xs text-gray-500">Egasi: {company.profiles?.full_name}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400" /> {company.location}</p>
              {company.website && (
                <p className="flex items-center"><Globe className="h-4 w-4 mr-2 text-gray-400" /> {company.website}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
