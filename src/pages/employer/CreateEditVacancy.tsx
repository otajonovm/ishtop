import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Info,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign
} from 'lucide-react';

export const CreateEditVacancy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salary: '',
    location: '',
    job_type: 'full_time',
    experience: '',
    deadline: '',
    status: 'active',
  });

  useEffect(() => {
    if (id) {
      const fetchVacancy = async () => {
        try {
          const { data, error } = await supabase
            .from('vacancies')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              requirements: data.requirements || '',
              responsibilities: data.responsibilities || '',
              salary: data.salary || '',
              location: data.location || '',
              job_type: data.job_type || 'full_time',
              experience: data.experience || '',
              deadline: data.deadline ? data.deadline.slice(0, 10) : '',
              status: data.status || 'active',
            });
          }
        } catch (err) {
          console.error(err);
          navigate('/employer/vacancies');
        } finally {
          setFetching(false);
        }
      };
      fetchVacancy();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let resolvedCompanyId = profile?.company_id || null;

      if (!resolvedCompanyId) {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('employer_id', user.id)
          .maybeSingle();

        if (companyError) throw companyError;
        resolvedCompanyId = company?.id || null;
      }

      if (!resolvedCompanyId) {
        alert('Vakansiya qo‘shishdan oldin kompaniya ma‘lumotlarini to‘ldirishingiz kerak.');
        navigate('/employer/company');
        return;
      }

      const vacancyData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        salary: formData.salary,
        location: formData.location,
        job_type: formData.job_type,
        experience: formData.experience,
        deadline: formData.deadline || null,
        status: formData.status,
        company_id: resolvedCompanyId,
        employer_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase
          .from('vacancies')
          .update(vacancyData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('vacancies')
          .insert([vacancyData]);
        if (error) throw error;
      }

      navigate('/employer/vacancies');
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi. Iltimos barcha maydonlarni tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loading fullScreen />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link
        to="/employer/vacancies"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Boshqaruvga qaytish
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {id ? 'Vakansiyani tahrirlash' : 'Yangi vakansiya yaratish'}
          </h1>
          <p className="text-gray-500 mt-1">Nomzodlar uchun barcha talablar va vazifalarni aniq ko‘rsating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Vakansiya sarlavhasi *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Senior React Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Ish turi</label>
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              >
                <option value="full_time">To‘liq kun</option>
                <option value="part_time">Yarim stavka</option>
                <option value="remote">Masofaviy</option>
                <option value="contract">Shartnoma</option>
                <option value="internship">Amaliyot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Holati</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'closed' })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              >
                <option value="active">Faol</option>
                <option value="closed">Yopilgan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Maosh (UZS yoki Kelishuvda)</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Masalan: 15,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Manzil</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Toshkent shahri"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Ish tajribasi</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Masalan: 3+ yil"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Qabul muddati (Deadline)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Batafsil tavsif *</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Ish haqida batafsil ma‘lumot..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Talablar</label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="mt-1 block w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Har bir talabni yangi qatordan yozing..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Vazifalar</label>
              <textarea
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="mt-1 block w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                placeholder="Ish vazifalari haqida..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-50">
            <Link
              to="/employer/vacancies"
              className="rounded-xl px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-10 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> {id ? 'Yangilash' : 'Saqlash'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
