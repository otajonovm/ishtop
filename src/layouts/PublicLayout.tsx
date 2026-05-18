import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
