import React from 'react';
import { useBimbel } from '../context/BimbelContext';
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  LogOut,
  UserCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    role,
    setRole,
    currentTentor,
    reports,
  } = useBimbel();

  const pendingReportsCount = reports.filter((r) => r.status === 'Menunggu Verifikasi').length;

  return (
    <header className="sticky top-0 z-30 bg-[#081F5C] text-[#FFF9F0] border-b border-[#334EAC]/40 shadow-sm backdrop-blur-md">
      {/* Cosmic ambient light line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#334EAC] via-[#7096D1] to-[#BAD6EB]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#334EAC] to-[#081F5C] border border-[#7096D1]/50 flex items-center justify-center shadow-inner text-[#FFF9F0] relative overflow-hidden">
              <Sparkles className="w-5 h-5 text-[#BAD6EB]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D0E3FF] rounded-full blur-xs opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#FFF9F0]">
                  Albirru Junior
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-[#BAD6EB] bg-[#334EAC]/60 px-2 py-0.5 rounded border border-[#7096D1]/30">
                  PORTAL TERPADU
                </span>
              </div>
              <p className="text-xs text-[#BAD6EB]/80 font-medium hidden sm:block">
                Bimbingan Belajar Kosmik Berprestasi · Maks. 6 Siswa / Kelompok
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation / Role Switcher */}
          {currentUser && currentUser.role === 'admin' ? (
            <nav className="flex items-center bg-[#081F5C]/80 p-1 rounded-xl border border-[#334EAC]/60 shadow-inner">
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  role === 'admin'
                    ? 'bg-[#334EAC] text-[#FFF9F0] shadow-md border border-[#7096D1]/60'
                    : 'text-[#BAD6EB] hover:text-[#FFF9F0] hover:bg-[#334EAC]/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#BAD6EB]" />
                <span>Dashboard Admin</span>
                {pendingReportsCount > 0 && (
                  <span className="bg-[#BAD6EB] text-[#081F5C] text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                    {pendingReportsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setRole('tentor')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  role === 'tentor'
                    ? 'bg-[#334EAC] text-[#FFF9F0] shadow-md border border-[#7096D1]/60'
                    : 'text-[#BAD6EB] hover:text-[#FFF9F0] hover:bg-[#334EAC]/30'
                }`}
                title="Tinjau tampilan tentor"
              >
                <GraduationCap className="w-4 h-4 text-[#BAD6EB]" />
                <span className="hidden sm:inline">Pratinjau Tentor</span>
                <span className="sm:hidden">Tentor</span>
              </button>
            </nav>
          ) : currentUser && currentUser.role === 'tentor' ? (
            <div className="flex items-center gap-2 bg-[#334EAC]/40 px-3.5 py-1.5 rounded-xl border border-[#7096D1]/40 text-xs">
              <GraduationCap className="w-4 h-4 text-[#BAD6EB]" />
              <span className="font-bold text-[#FFF9F0]">Dashboard Pengajar</span>
              <span className="text-[#BAD6EB]/60 hidden sm:inline">· Sesi & Laporan Belajar</span>
            </div>
          ) : null}

          {/* Zone 3: Active User & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-bold text-[#FFF9F0]">
                      {currentUser.role === 'admin'
                        ? 'Administrator'
                        : currentTentor.name.split(',')[0]}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-[#334EAC] text-[#BAD6EB] border border-[#7096D1]/40">
                      {currentUser.role === 'admin' ? 'Admin' : 'Tentor'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#BAD6EB]/80 font-mono">
                    @{currentUser.username}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-[#334EAC] border-2 border-[#7096D1] flex items-center justify-center font-bold text-xs text-[#FFF9F0] shadow-sm">
                  {currentUser.role === 'admin'
                    ? 'AD'
                    : currentTentor.name.split(' ')[1]?.[0] || 'T'}
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#BAD6EB] hover:text-white bg-[#334EAC]/40 hover:bg-red-500/80 hover:border-red-400 border border-[#7096D1]/40 px-2.5 py-1.5 rounded-xl transition-all ml-1 cursor-pointer"
                  title="Keluar dari akun (Logout)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#334EAC]/30 border border-[#7096D1]/40 rounded-xl px-3 py-1.5 text-xs text-[#BAD6EB]">
                <UserCheck className="w-4 h-4 text-[#BAD6EB]" />
                <span className="font-semibold text-[#FFF9F0]">Silakan Masuk</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
