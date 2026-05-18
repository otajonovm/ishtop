import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Send
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatSalary } from '../../lib/utils';
import { StatusBadge } from '../../components/StatusBadge';
import { motion } from 'motion/react';

export const VacancyDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*, companies(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setVacancy(data);

        if (user) {
          const { data: appData } = await supabase
            .from('applications')
            .select('id')
            .eq('vacancy_id', id)
            .eq('job_seeker_id', user.id)
            .single();
          
          if (appData) setHasApplied(true);
        }
      } catch (err) {
        console.error(err);
        navigate('/vacancies');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id, user, navigate]);

  if (loading) return <Loading fullScreen />;
  if (!vacancy) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Link
        to="/vacancies"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Orqaga qaytish
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{vacancy.title}</h1>
                  <StatusBadge status={vacancy.status} />
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold">{vacancy.companies?.name}</span>
                </div>
              </div>
              {vacancy.companies?.logo_url && (
                <img
                  src={vacancy.companies.logo_url}
                  alt={vacancy.companies.name}
                  className="h-16 w-16 rounded-xl object-cover shadow-sm border border-gray-50"
                />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Joylashuv</p>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <MapPin className="mr-1.5 h-4 w-4 text-blue-500" /> {vacancy.location}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ish turi</p>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <Briefcase className="mr-1.5 h-4 w-4 text-blue-500" /> {vacancy.job_type?.replace('_', ' ')}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Maosh</p>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <DollarSign className="mr-1.5 h-4 w-4 text-blue-500" /> {formatSalary(vacancy.salary)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Tajriba</p>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <ChevronRight className="mr-1.5 h-4 w-4 text-blue-500" /> {vacancy.experience || 'Istalgan'}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900">Tavsif</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{vacancy.description}</p>
              </section>

              {vacancy.requirements && (
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900">Talablar</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{vacancy.requirements}</p>
                </section>
              )}

              {vacancy.responsibilities && (
                <section className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900">Vazifalar</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{vacancy.responsibilities}</p>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Company */}
        <div className="space-y-8">
          {/* Apply Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md sticky top-24 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Muddati:</span>
                <span className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4 text-blue-500" />
                  {vacancy.deadline ? formatDate(vacancy.deadline) : 'Belgilanmagan'}
                </span>
              </div>
              
              {hasApplied ? (
                <div className="rounded-xl bg-green-50 p-4 border border-green-100">
                  <p className="text-sm font-semibold text-green-800 flex items-center justify-center">
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Siz ushbu vakansiyaga ariza yuborgansiz.
                  </p>
                </div>
              ) : vacancy.status === 'closed' ? (
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-500 flex items-center justify-center text-center">
                    Ushbu vakansiya bo‘yicha qabul yopilgan.
                  </p>
                </div>
              ) : (
                <Link
                  to={user ? `/dashboard/apply/${vacancy.id}` : '/login'}
                  className="block w-full text-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
                >
                  Ariza yuborish <Send className="ml-2 inline-block h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-4">
              <h3 className="font-bold text-gray-900">Kompaniya haqida</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">{vacancy.companies?.description}</p>
                <div className="flex flex-col space-y-2">
                  {vacancy.companies?.website && (
                    <a
                      href={vacancy.companies.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Veb-sayt <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="mr-1.5 h-4 w-4" /> {vacancy.companies?.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
