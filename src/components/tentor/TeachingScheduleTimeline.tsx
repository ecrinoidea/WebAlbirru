import React from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { SESSION_CONFIGS } from '../../types';
import {
  Clock,
  MapPin,
  FileEdit,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface TeachingScheduleTimelineProps {
  onSelectSessionToReport: (groupId: string, sessionSlot: string) => void;
}

export const TeachingScheduleTimeline: React.FC<TeachingScheduleTimelineProps> = ({
  onSelectSessionToReport,
}) => {
  const { currentTentor, groups, reports } = useBimbel();

  // Find all groups assigned to this tentor
  const myGroups = groups.filter((g) => g.tentorId === currentTentor.id);

  return (
    <div className="space-y-6">
      
      {/* Banner Notice */}
      <div className="bg-[#FFF9F0] p-4 sm:p-5 rounded-2xl border border-[#BAD6EB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#334EAC]" />
            <h3 className="text-base font-bold text-[#081F5C]">
              Jadwal Mengajar Otomatis — {currentTentor.name}
            </h3>
          </div>
          <p className="text-xs text-[#081F5C]/75">
            Sinkronisasi waktu nyata dari jadwal terbit admin. Anda mengampu {myGroups.length} kelompok belajar aktif.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#D0E3FF]/50 border border-[#BAD6EB] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#081F5C]">
          <Calendar className="w-4 h-4 text-[#334EAC]" />
          <span>Hari Ini: Kamis, 24 September 2026</span>
        </div>
      </div>

      {/* Sesi Timeline List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-[#081F5C] uppercase tracking-wider flex items-center gap-1.5">
          <span>Daftar Sesi Terjadwal Pekan Ini:</span>
        </h4>

        {myGroups.length === 0 ? (
          <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-8 text-center text-xs text-[#081F5C]/70">
            Belum ada kelompok belajar yang ditugaskan ke profil Anda. Hubungi administrator bimbel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map((group) => {
              const sessionInfo = SESSION_CONFIGS.find((s) => s.id === group.sessionSlot);
              
              // Check if report already submitted for today or this session
              const existingReport = reports.find(
                (r) => r.groupId === group.id && r.tentorId === currentTentor.id
              );
              const isReported = !!existingReport;

              return (
                <div
                  key={group.id}
                  className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-5 shadow-xs hover:border-[#7096D1] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-[#334EAC] text-white px-2.5 py-0.5 rounded-lg">
                          {group.scheduleDay}
                        </span>
                        <span className="text-xs font-semibold text-[#081F5C] bg-[#D0E3FF] px-2 py-0.5 rounded-lg border border-[#BAD6EB]">
                          {sessionInfo?.name} ({sessionInfo?.timeRange})
                        </span>
                      </div>

                      {isReported ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Laporan Terkirim
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" /> Siap Dilaporkan
                        </span>
                      )}
                    </div>

                    {/* Group Title */}
                    <h3 className="text-base font-bold text-[#081F5C] mb-1">
                      {group.name}
                    </h3>
                    <p className="text-xs text-[#334EAC] font-semibold mb-3">
                      Mata Pelajaran: {group.currentSubject} ({group.gradeLevel})
                    </p>

                    {/* Room & Capacity */}
                    <div className="space-y-1.5 text-xs text-[#081F5C]/80 mb-4 bg-[#F7F2EB] p-3 rounded-xl border border-[#BAD6EB]/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#334EAC] shrink-0" />
                        <span>Ruang Kelas: <strong className="text-[#081F5C]">{group.room}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#334EAC] shrink-0" />
                        <span>Durasi: 90 Menit Efektif</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span>Jumlah Siswa:</span>
                        <span className="font-bold text-[#081F5C]">{group.students.length} / 6 Siswa Terdaftar</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-[#BAD6EB]/50 flex items-center justify-between">
                    <span className="text-[11px] text-[#081F5C]/70">
                      Honor: <strong className="text-[#081F5C]">Rp {currentTentor.ratePerSession.toLocaleString('id-ID')}</strong>
                    </span>

                    <button
                      onClick={() => onSelectSessionToReport(group.id, group.sessionSlot)}
                      className="px-4 py-2 bg-[#334EAC] hover:bg-[#081F5C] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>{isReported ? 'Input Laporan Sesi Baru' : 'Isi Laporan Sesi Ini'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
