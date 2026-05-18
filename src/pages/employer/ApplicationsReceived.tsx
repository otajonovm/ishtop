import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { StatusBadge, StatusType } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  User, 
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ApplicationsReceived = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          vacancies(title),
          profiles:job_seeker_id(*),
          documents(*)
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const updateStatus = async (appId: string, newStatus: StatusType) => {
    setUpdating(appId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId);

      if (error) throw error;
      setApplications(applications.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert('Statusni o‘zgartirishda xatolik.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kelgan Arizalar</h1>
        <p className="text-gray-500">Nomzodlar tomonidan yuborilgan barcha murojaatlar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedApp?.id === app.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600'
                    : 'border-gray-100 bg-white hover:border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                    {app.profiles?.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{app.profiles?.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{app.vacancies?.title}</p>
                  </div>
                  <StatusBadge status={app.status} className="scale-75" />
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Arizalar yo‘q" icon={FileText} />
          )}
        </div>

        {/* Details View */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 space-y-8 sticky top-24"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {selectedApp.profiles?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApp.profiles?.full_name}</h2>
                    <p className="text-gray-500 font-medium">Lavozim: {selectedApp.vacancies?.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={selectedApp.status} className="px-4 py-1.5" />
                  <p className="mt-2 text-xs text-gray-400">Yuborilgan sana: {formatDate(selectedApp.created_at)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-900">makhsudbek@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Telefon</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedApp.profiles?.phone || 'Kiritilmagan'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-600" /> Nomzoddan xabar
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed italic border border-gray-100">
                  {selectedApp.message || 'Xabar yo‘q.'}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" /> Yuklangan hujjatlar
                </h3>
                {selectedApp.documents?.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {selectedApp.documents.map((doc: any) => (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-400 hover:shadow-md transition-all group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                          <Download className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{doc.file_name}</p>
                          <p className="text-[10px] text-gray-400 uppercase">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Hujjatlar yuklanmagan.</p>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Statusni o‘zgartirish</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { val: 'korib_chiqilmoqda', label: 'Ko‘rib chiqish' },
                    { val: 'suhbatga_chaqirildi', label: 'Suhbatga chaqirish' },
                    { val: 'qabul_qilindi', label: 'Qabul qilish' },
                    { val: 'rad_etildi', label: 'Rad etish' }
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      onClick={() => updateStatus(selectedApp.id, btn.val as StatusType)}
                      disabled={updating !== null}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50",
                        selectedApp.status === btn.val
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {updating === selectedApp.id && selectedApp.status !== btn.val ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        btn.label
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-10" />
                <p className="font-medium">Ariza batafsil ma‘lumotlarini ko‘rish uchun chapdan tanlang</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
