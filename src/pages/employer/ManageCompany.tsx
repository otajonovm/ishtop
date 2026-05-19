import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import { Building2, MapPin, Globe, Save, Loader2, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';

export const ManageCompany = () => {
  const { user, profile, setProfile } = useAuth();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    logo_url: '',
  });
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('employer_id', user.id)
          .maybeSingle();

        if (data) {
          setCompanyId(data.id);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            location: data.location || '',
            website: data.website || '',
            logo_url: data.logo_url || '',
          });
          setLogoPreview(data.logo_url || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [user]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Iltimos, faqat rasm faylini tanlang.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({ ...prev, logo_url: dataUrl }));
      setLogoPreview(dataUrl);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);

    try {
      const companyData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        website: formData.website,
        logo_url: formData.logo_url,
        employer_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let company;

      if (companyId) {
        // Agar kompaniya allaqachon mavjud bo'lsa, uni UPDATE qilamiz
        const { data, error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', companyId)
          .select()
          .single();
        if (error) throw error;
        company = data;
      } else {
        // Agar birinchi marta yaratilayotgan bo'lsa, INSERT qilamiz
        const { data, error } = await supabase
          .from('companies')
          .insert(companyData)
          .select()
          .single();
        if (error) throw error;
        company = data;
        setCompanyId(company.id);
      }

      // 2. Update profile with company_id and sync local auth state
      await supabase
        .from('profiles')
        .update({ company_id: company.id })
        .eq('id', user.id);

      const updatedProfile = {
        ...(profile || {}),
        id: user.id,
        email: user.email,
        company_id: company.id,
      };
      setProfile(updatedProfile);
      localStorage.setItem('mock_user_profile', JSON.stringify(updatedProfile));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kompaniya Ma‘lumotlari</h1>
        <p className="text-gray-500">Ish izlovchilarga o'z kompaniyangiz haqida so‘zlab bering</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Kompaniya nomi *</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                  placeholder="MCHJ 'Best Solutions'"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Manzil</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                  placeholder="Toshkent sh., Yunusobod tumani"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Veb-sayt</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Logo fayli (ixtiyoriy)</label>
              <div className="mt-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Kampaniya logosi"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Rasmni kompyuterdan yuklang</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP formatlar tavsiya etiladi</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Fayl tanlash
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Tavsif / Kompaniya haqida</label>
              <div className="mt-1 relative">
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                  placeholder="Kompaniya faoliyati haqida batafsil..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50">
            <div>
              {success && (
                <p className="text-sm font-semibold text-green-600 flex items-center">
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Ma‘lumotlar saqlandi!
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-10 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Saqlash</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
