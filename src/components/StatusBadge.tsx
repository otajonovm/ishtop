import React from 'react';
import { cn } from '../lib/utils';

export type StatusType = 
  | 'yangi' 
  | 'korib_chiqilmoqda' 
  | 'suhbatga_chaqirildi' 
  | 'qabul_qilindi' 
  | 'rad_etildi'
  | 'active'
  | 'closed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; color: string }> = {
  yangi: { label: 'Yangi', color: 'bg-slate-50 text-slate-600 border-slate-100' },
  korib_chiqilmoqda: { label: 'Ko‘rib chiqilmoqda', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  suhbatga_chaqirildi: { label: 'Suhbatga chaqirildi', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  qabul_qilindi: { label: 'Qabul qilindi', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  rad_etildi: { label: 'Rad etildi', color: 'bg-red-50 text-red-600 border-red-100' },
  active: { label: 'Faol', color: 'bg-green-50 text-green-600 border-green-100' },
  closed: { label: 'Yopilgan', color: 'bg-slate-100 text-slate-400 border-slate-200' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || { label: status, color: 'bg-slate-50 text-slate-400 border-slate-100' };
  
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition-colors', config.color, className)}>
      {config.label}
    </span>
  );
};
