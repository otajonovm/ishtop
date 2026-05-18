import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Settings, 
  UserCircle 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export const Sidebar = () => {
  const { profile } = useAuth();
  
  const adminItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
    { name: 'Kompaniyalar', href: '/admin/companies', icon: Building2 },
    { name: 'Vakansiyalar', href: '/admin/vacancies', icon: Briefcase },
    { name: 'Arizalar', href: '/admin/applications', icon: FileText },
  ];

  const employerItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/employer', icon: LayoutDashboard },
    { name: 'Kompaniyam', href: '/employer/company', icon: Building2 },
    { name: 'Vakansiyalar', href: '/employer/vacancies', icon: Briefcase },
    { name: 'Arizalar', href: '/employer/applications', icon: FileText },
  ];

  const jobSeekerItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mening arizalarim', href: '/dashboard/applications', icon: FileText },
    { name: 'Profil', href: '/dashboard/profile', icon: UserCircle },
  ];

  const items = profile?.role === 'admin' 
    ? adminItems 
    : profile?.role === 'employer' 
      ? employerItems 
      : jobSeekerItems;

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-screen shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg shadow-blue-100">V</div>
        <span className="font-bold text-xl tracking-tight text-blue-900">Vakansiya</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href.split('/').length <= 2}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-colors'
                )}
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl shadow-slate-200">
          <p className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider">{profile?.role?.replace('_', ' ')}</p>
          <p className="text-sm font-semibold truncate">{profile?.full_name || 'Foydalanuvchi'}</p>
        </div>
      </div>
    </aside>
  );
};
