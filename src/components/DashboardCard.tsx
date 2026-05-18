import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: string;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  color = 'blue',
  className,
}) => {
  const colorVariants: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-indigo-100 text-indigo-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-slate-100 text-slate-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn('bento-stat-card', className)}
    >
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', colorVariants[color] || colorVariants.blue)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 leading-none">{value}</h3>
        {description && <p className="mt-1 text-xs text-slate-400 italic">{description}</p>}
      </div>
    </motion.div>
  );
};
