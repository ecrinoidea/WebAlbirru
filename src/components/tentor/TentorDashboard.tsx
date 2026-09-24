import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { TeachingScheduleTimeline } from './TeachingScheduleTimeline';
import { SessionReportForm } from './SessionReportForm';
import { AssignedGroups } from './AssignedGroups';
import { HonorStatus } from './HonorStatus';
import {
  Calendar,
  FileEdit,
  Users,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export const TentorDashboard: React.FC = () => {
  const {
    currentUser,
    currentTentor,
    tentors,
    selectedTentorId,
    setSelectedTentorId,
    activeTentorTab,
    setActiveTentorTab,
    reports,
  } = useBimbel();

  const [prefilledGroupId, setPrefilledGroupId] = useState<string | undefined>();
  const [prefilledSlot, setPrefilledSlot] = useState<string | undefined>();

  const myPendingCount = reports.filter(
    (r) => r.tentorId === currentTentor.id && r.status === 'Menunggu Verifikasi'
  ).length;

  const handleSelectSessionToReport = (groupId: string, sessionSlot: string) => {
    setPrefilledGroupId(groupId);
    setPrefilledSlot(sessionSlot);
    setActiveTentorTab('input-report');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Admin Preview Mode Banner (Only shown if admin is inspecting) */}
      {currentUser?.role === 'admin' && (
        <div className="mb-4 bg-[#334EAC] text-[#FFF9F0] p-3 rounded-xl border border-[#7096D1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#BAD6EB]" />
            <span className="font-semibold">
              Mode Pratinjau Admin: Anda dapat memeriksa perspektif dashboard untuk tiap tentor.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#BAD6EB] font-medium">Pilih Profil Tentor:</span>
            <select
              value={selectedTentorId}
              onChange={(e) => setSelectedTentorId(e.target.value)}
              aria-label="Pilih Tentor yang Dipratinjau"
              className="bg-[#081F5C] text-[#FFF9F0] border border-[#7096D1] text-xs font-bold px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              {tentors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (@{t.username})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tentor Profile Banner */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-5 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#334EAC] to-[#081F5C] text-[#FFF9F0] flex items-center justify-center text-xl font-black border-2 border-[#7096D1] shadow-sm">
            {currentTentor.name.split(' ')[1]?.[0] || 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#081F5C]">
                {currentTentor.name}
              </h1>
              <span className="text-[11px] font-bold text-[#334EAC] bg-[#D0E3FF] px-2 py-0.5 rounded-full border border-[#BAD6EB]">
                Tentor Aktif
              </span>
            </div>
            <p className="text-xs text-[#081F5C]/80 mt-0.5">
              {currentTentor.title} · {currentTentor.email}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentTentor.subjects.map((subj, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-[#081F5C] bg-[#F7F2EB] px-2 py-0.5 rounded border border-[#BAD6EB]/60"
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#081F5C] text-[#FFF9F0] px-4 py-2.5 rounded-xl border border-[#334EAC] shadow-xs self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-left">
            <span className="text-[10px] text-[#BAD6EB] uppercase tracking-wider block font-medium">
              Honor Per Sesi
            </span>
            <span className="text-base font-extrabold tabular-nums text-white">
              Rp {currentTentor.ratePerSession.toLocaleString('id-ID')}
            </span>
          </div>
          <Sparkles className="w-5 h-5 text-[#BAD6EB]" />
        </div>
      </div>

      {/* Tentor Navigation Tabs */}
      <div className="border-b border-[#BAD6EB] mb-6">
        <nav className="flex space-x-2 overflow-x-auto pb-px" aria-label="Tabs Tentor">
          
          <button
            onClick={() => setActiveTentorTab('schedule')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTentorTab === 'schedule'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Mengajar Otomatis</span>
          </button>

          <button
            onClick={() => setActiveTentorTab('input-report')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTentorTab === 'input-report'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Formulir Input Laporan Sesi</span>
          </button>

          <button
            onClick={() => setActiveTentorTab('my-groups')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTentorTab === 'my-groups'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Kelompok yang Diampu</span>
          </button>

          <button
            onClick={() => setActiveTentorTab('honor')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTentorTab === 'honor'
                ? 'border-[#334EAC] text-[#334EAC] bg-[#D0E3FF]/30 rounded-t-xl'
                : 'border-transparent text-[#081F5C]/70 hover:text-[#081F5C] hover:border-[#BAD6EB]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Status Honor & Verifikasi</span>
            {myPendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {myPendingCount} Antre
              </span>
            )}
          </button>

        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTentorTab === 'schedule' && (
          <TeachingScheduleTimeline
            onSelectSessionToReport={handleSelectSessionToReport}
          />
        )}

        {activeTentorTab === 'input-report' && (
          <SessionReportForm
            initialGroupId={prefilledGroupId}
            initialSessionSlot={prefilledSlot}
            onSuccess={() => setActiveTentorTab('honor')}
          />
        )}

        {activeTentorTab === 'my-groups' && <AssignedGroups />}

        {activeTentorTab === 'honor' && <HonorStatus />}
      </div>

    </div>
  );
};
