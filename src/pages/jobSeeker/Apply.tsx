import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { FileUpload } from '../../components/FileUpload';
import { ArrowLeft, Send, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Apply = () => {
  const { vacancyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vacancy, setVacancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [fileData, setFileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSubmitError = (err: any) => {
    const message = err?.message || 'Noma’lum xatolik';
    const code = err?.code || err?.status || err?.statusCode || '';
    return code ? `${message} (code: ${code})` : message;
  };

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*, companies(*)')
          .eq('id', vacancyId)
          .single();

        if (error) throw error;
        setVacancy(data);
      } catch (err) {
        console.error(err);
        navigate('/vacancies');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [vacancyId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vacancy) return;
    if (!fileData) {
      setError('Iltimos, rezyume yoki kerakli hujjatni yuklang.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Create application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert([
          {
            vacancy_id: vacancyId,
            job_seeker_id: user.id,
            employer_id: vacancy.employer_id,
            message: message,
            status: 'yangi',
          },
        ])
        .select()
        .single();

      if (appError) throw appError;

      // 2. Link document to application
      const { error: docError } = await supabase
        .from('documents')
        .insert([
          {
            application_id: application.id,
            user_id: user.id,
            file_name: fileData.file_name,
            file_path: fileData.file_path,
            file_url: fileData.file_url,
            file_type: fileData.file_type,
            file_size: fileData.file_size,
          },
        ]);

      if (docError) throw docError;

      navigate('/dashboard/applications');
    } catch (err: any) {
      console.error(err);
      setError(`Ariza yuborishda xatolik: ${formatSubmitError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        to={`/vacancies/${vacancyId}`}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Vakansiyaga qaytish
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Ariza yuborish</h1>
          <p className="text-gray-500 mt-1">
            <span className="font-bold text-gray-900">{vacancy.title}</span> - {vacancy.companies?.name}
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-900">Qo‘shimcha xabar (ixtiyoriy)</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="O‘zingiz haqingizda qisqacha ma‘lumot yoki nima uchun munosibligingizni yozishingiz mumkin..."
              className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-900">Rezyume / Hujjat *</label>
            <FileUpload onUploadComplete={setFileData} />
            <p className="text-xs text-gray-400">
              Istalgan formatdagi faylni yuklang. Fayl hajmi 5MB gacha.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center"
            >
              {submitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Yuborish <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
