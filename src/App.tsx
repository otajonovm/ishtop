import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Vacancies } from './pages/public/Vacancies';
import { VacancyDetails } from './pages/public/VacancyDetails';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Job Seeker Pages
import { JobSeekerDashboard } from './pages/jobSeeker/Dashboard';
import { Profile } from './pages/jobSeeker/Profile';
import { UserApplications } from './pages/jobSeeker/Applications';
import { Apply } from './pages/jobSeeker/Apply';

// Employer Pages
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { ManageCompany } from './pages/employer/ManageCompany';
import { ManageVacancies } from './pages/employer/ManageVacancies';
import { CreateEditVacancy } from './pages/employer/CreateEditVacancy';
import { ApplicationsReceived } from './pages/employer/ApplicationsReceived';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCompanies } from './pages/admin/AdminCompanies';
import { AdminVacancies } from './pages/admin/AdminVacancies';
import { AdminApplications } from './pages/admin/AdminApplications';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="vacancies" element={<Vacancies />} />
            <Route path="vacancies/:id" element={<VacancyDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Job Seeker Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['job_seeker']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="dashboard" element={<JobSeekerDashboard />} />
                <Route path="dashboard/profile" element={<Profile />} />
                <Route path="dashboard/applications" element={<UserApplications />} />
                <Route path="dashboard/apply/:vacancyId" element={<Apply />} />
              </Route>
            </Route>
          </Route>

          {/* Employer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['employer']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="employer" element={<EmployerDashboard />} />
                <Route path="employer/company" element={<ManageCompany />} />
                <Route path="employer/vacancies" element={<ManageVacancies />} />
                <Route path="employer/vacancies/create" element={<CreateEditVacancy />} />
                <Route path="employer/vacancies/edit/:id" element={<CreateEditVacancy />} />
                <Route path="employer/applications" element={<ApplicationsReceived />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/companies" element={<AdminCompanies />} />
                <Route path="admin/vacancies" element={<AdminVacancies />} />
                <Route path="admin/applications" element={<AdminApplications />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
