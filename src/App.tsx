import React from 'react';
import { BimbelProvider, useBimbel } from './context/BimbelContext';
import { Header } from './components/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TentorDashboard } from './components/tentor/TentorDashboard';
import { LoginPage } from './components/auth/LoginPage';
import { PhotoPreviewModal } from './components/common/PhotoPreviewModal';
import { Toast } from './components/common/Toast';
import { Sparkles, Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, role } = useBimbel();

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <LoginPage />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#081F5C] flex flex-col font-sans selection:bg-[#BAD6EB] selection:text-[#081F5C]">
      {/* Navigation Bar */}
      <Header />

      {/* Dynamic Main Workspace Canvas */}
      <main className="min-h-[calc(100vh-64px)] pb-16">
        {role === 'admin' ? <AdminDashboard /> : <TentorDashboard />}
      </main>

      {/* Global Modals & Notifications */}
      <PhotoPreviewModal />
      <Toast />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-[#BAD6EB]/80 bg-[#F7F2EB] py-6 text-xs text-[#081F5C]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#334EAC]" />
            <span className="font-bold text-[#081F5C]">
              Bimbel Albirru Junior
            </span>
            <span aria-hidden="true" className="text-[#BAD6EB]">·</span>
            <span>Sistem Manajemen Pembelajaran Terpadu & Terarah</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#7096D1]" />
              Palet Warna Kosmik Albirru
            </span>
            <span aria-hidden="true" className="text-[#BAD6EB]">·</span>
            <span>Maksimal 6 Siswa / Kelompok Belajar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BimbelProvider>
      <AppContent />
    </BimbelProvider>
  );
}
