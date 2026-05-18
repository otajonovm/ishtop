import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatDate, formatSalary } from '../lib/utils';

interface VacancyCardProps {
  vacancy: any;
  showAdminActions?: boolean;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy }) => {
  return (
    <div className="group relative bento-card p-6 overflow-hidden">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                {vacancy.title}
              </h3>
              <StatusBadge status={vacancy.status} />
            </div>
            <p className="text-sm font-semibold text-slate-400 italic">{vacancy.companies?.name}</p>
          </div>
          {vacancy.companies?.logo_url ? (
            <img
              src={vacancy.companies.logo_url}
              alt={vacancy.companies.name}
              className="h-14 w-14 rounded-2xl object-cover shadow-sm border border-slate-100"
            />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
               <Briefcase className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <span className="truncate">{vacancy.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
               <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <span className="capitalize truncate">{vacancy.job_type?.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <span className="truncate font-bold text-slate-700">{formatSalary(vacancy.salary)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <span className="truncate">{formatDate(vacancy.created_at)}</span>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-50 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {vacancy.deadline ? `Deadline: ${formatDate(vacancy.deadline)}` : 'No Deadline'}
          </div>
          <Link
            to={`/vacancies/${vacancy.id}`}
            className="btn-primary py-1.5 px-3 text-xs"
          >
            Batafsil
          </Link>
        </div>
      </div>
    </div>
  );
};
