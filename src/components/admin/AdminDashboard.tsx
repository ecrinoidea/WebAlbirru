import React from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { KpiHeader } from './KpiHeader';
import { GroupManagement } from './GroupManagement';
import { TentorScheduleMatrix } from './TentorScheduleMatrix';
import { ReportVerification } from './ReportVerification';
import { FinancialSummary } from './FinancialSummary';
import { TentorAccountManagement } from './TentorAccountManagement';
import {
  Users,
  CalendarDays,
  FileCheck2,
  Wallet,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, reports, tentors } = useBimbel();

  const pendingReportsCount = reports.filter((r) => r.status === 'Menunggu Verifikasi').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Editorial Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#081F5C]">
              Dashboard Admin
            </h1>
            <span className="text-xs font-bold text-[#334EAC] bg-[#D0E3FF] px-2 py-0.5 rounded-md border border-[#BAD6EB]">
              Pusat Kendali
            </span>
          </div>
          <p className="text-xs text-[#081F5C]/75 mt-0.5">
            Pusat kendali akademik, kapasitas kelompok belajar (maks. 6 siswa), akun & kredensial tentor, jadwal kesiapan, dan finansial Bimbel Albirru Junior.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#334EAC] font-semibold bg-[#FFF9F0] border border-[#BAD6EB] px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-[#7096D1]" />
          <span>Tahun Ajaran 2026/2027 · Semester Ganjil</span>
        </div>
      </div>

      {/* KPI Header */}
      <KpiHeader />

      {/* Admin Navigation Tabs */}
      <div className="border-b border-[#BAD6EB] mb-6">
        <nav className="flex space-x-2 overflow-x-auto pb-px" aria-label="Tabs Admin">
          
          <button
            onClick={() => setActiveAdminTab('groups')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeAdminTab === 'groups'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Kelompok Belajar</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('schedule')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeAdminTab === 'schedule'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Matriks Jadwal Tentor (Ready Schedule)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('verification')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeAdminTab === 'verification'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Verifikasi Laporan & Presensi</span>
            {pendingReportsCount > 0 && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {pendingReportsCount} Baru
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('finance')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeAdminTab === 'finance'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Ringkasan Keuangan (SPP & Honor)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('tentors')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeAdminTab === 'tentors'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Akun & Kredensial Tentor</span>
            <span className="bg-[#D0E3FF] text-[#081F5C] text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
              {tentors.length}
            </span>
          </button>

        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {activeAdminTab === 'groups' && <GroupManagement />}
        {activeAdminTab === 'schedule' && <TentorScheduleMatrix />}
        {activeAdminTab === 'verification' && <ReportVerification />}
        {activeAdminTab === 'finance' && <FinancialSummary />}
        {activeAdminTab === 'tentors' && <TentorAccountManagement />}
      </div>

    </div>
  );
};
