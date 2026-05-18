import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'admin': return '/admin';
      case 'employer': return '/employer';
      case 'job_seeker': return '/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">IshTop</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/vacancies" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Vakansiyalar
              </Link>
              {user ? (
                <div className="flex items-center space-x-6">
                  <Link to={getDashboardLink()} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </div>
                      <span>{profile?.full_name || 'Foydalanuvchi'}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-red-500 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
                  >
                    Ro‘yxatdan o‘tish
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4">
          <Link to="/vacancies" className="block text-base font-medium text-gray-600">Vakansiyalar</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="block text-base font-medium text-gray-600">Dashboard</Link>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{profile?.full_name}</span>
                <button onClick={handleSignOut} className="flex items-center text-sm font-medium text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Chiqish
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/login" className="text-center rounded-lg border border-gray-200 py-2 text-sm font-semibold">Kirish</Link>
              <Link to="/register" className="text-center rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white">Ro‘yxatdan o‘tish</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
