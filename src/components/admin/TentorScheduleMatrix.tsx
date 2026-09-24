import React from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { DayOfWeek, SESSION_CONFIGS, SessionTimeSlot, TentorAvailabilityStatus } from '../../types';
import {
  CalendarDays,
  CheckCircle,
  BookOpen,
  Coffee,
  Info,
  Clock,
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const TentorScheduleMatrix: React.FC = () => {
  const {
    tentors,
    availabilities,
    selectedDay,
    setSelectedDay,
    toggleTentorAvailability,
  } = useBimbel();

  const getSlotAvailability = (tentorId: string, slot: SessionTimeSlot) => {
    return availabilities.find(
      (a) => a.tentorId === tentorId && a.day === selectedDay && a.sessionSlot === slot
    );
  };

  const getStatusBadge = (status: TentorAvailabilityStatus, groupName?: string) => {
    switch (status) {
      case 'teaching':
        return (
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#334EAC] text-[#FFF9F0] text-center shadow-xs border border-[#7096D1]/50">
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#BAD6EB]" />
              <span>Sedang Mengajar</span>
            </div>
            {groupName && (
              <span className="text-[10px] text-[#D0E3FF] mt-0.5 font-medium truncate max-w-[140px]">
                {groupName}
              </span>
            )}
          </div>
        );
      case 'ready':
        return (
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#D0E3FF]/70 text-[#081F5C] text-center border border-[#BAD6EB]">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#334EAC]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ready Mengajar</span>
            </div>
            <span className="text-[10px] text-[#081F5C]/70 mt-0.5">Siap Ditugaskan</span>
          </div>
        );
      case 'off':
      default:
        return (
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F7F2EB] text-[#081F5C]/60 text-center border border-dashed border-[#BAD6EB]/80">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#081F5C]/70">
              <Coffee className="w-3.5 h-3.5" />
              <span>Jadwal Off</span>
            </div>
            <span className="text-[10px] text-[#081F5C]/50 mt-0.5">Tidak Tersedia</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Day Selector */}
      <div className="bg-[#FFF9F0] p-4 sm:p-5 rounded-2xl border border-[#BAD6EB]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-[#334EAC]" />
            <h3 className="text-base font-bold text-[#081F5C]">
              Matriks Ketersediaan Jadwal Tentor (Ready Schedule)
            </h3>
          </div>
          <p className="text-xs text-[#081F5C]/75">
            Pusat pantauan kesiapan harian tentor Albirru Junior per sesi belajar. Klik pada slot untuk mengubah status.
          </p>
        </div>

        {/* Day Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#F7F2EB] p-1.5 rounded-xl border border-[#BAD6EB]">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedDay === day
                  ? 'bg-[#334EAC] text-white shadow-xs'
                  : 'text-[#081F5C] hover:bg-[#BAD6EB]/30'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="bg-[#D0E3FF]/30 p-3 rounded-xl border border-[#BAD6EB] flex flex-wrap items-center justify-between gap-3 text-xs text-[#081F5C]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#334EAC] shrink-0" />
          <span className="font-medium">
            Keterangan Status Sesi (Hari <strong>{selectedDay}</strong>):
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ready Mengajar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#334EAC]" /> Sedang Mengajar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Jadwal Off
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#081F5C] text-[#FFF9F0] text-xs font-bold border-b border-[#334EAC]">
                <th className="py-3.5 px-4 w-72">
                  Nama Tentor & Keahlian
                </th>
                {SESSION_CONFIGS.map((session) => (
                  <th key={session.id} className="py-3.5 px-4 text-center">
                    <div>
                      <span>{session.name}</span>
                      <span className="block text-[11px] font-normal text-[#BAD6EB] flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 inline" /> {session.timeRange}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#BAD6EB]/50 text-xs">
              {tentors.map((tentor) => (
                <tr key={tentor.id} className="hover:bg-[#F7F2EB]/60 transition-colors">
                  
                  {/* Tentor Identity */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#334EAC] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {tentor.name.split(' ')[1]?.[0] || 'T'}
                      </div>
                      <div>
                        <div className="font-bold text-[#081F5C]">
                          {tentor.name}
                        </div>
                        <div className="text-[11px] text-[#081F5C]/70">
                          {tentor.title}
                        </div>
                        <div className="text-[10px] text-[#334EAC] font-semibold mt-0.5">
                          Honor: Rp {tentor.ratePerSession.toLocaleString('id-ID')} / sesi
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sessions Slots */}
                  {SESSION_CONFIGS.map((slot) => {
                    const avail = getSlotAvailability(tentor.id, slot.id);
                    const status: TentorAvailabilityStatus = avail ? avail.status : 'ready';
                    const groupName = avail?.assignedGroupName;

                    return (
                      <td
                        key={slot.id}
                        className="py-3 px-3 align-middle text-center"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTentorAvailability(tentor.id, selectedDay, slot.id)}
                          className="w-full text-left transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#334EAC] rounded-xl"
                          title="Klik untuk mengubah status ketersediaan"
                        >
                          {getStatusBadge(status, groupName)}
                        </button>
                      </td>
                    );
                  })}

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer */}
        <div className="bg-[#F7F2EB] px-4 py-3 border-t border-[#BAD6EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#081F5C]/75 gap-2">
          <span>
            💡 Tips Admin: Klik langsung pada kotak status untuk mengubah kesiapan mengajar tentor secara instan.
          </span>
          <span className="font-semibold text-[#334EAC]">
            Albirru Scheduler Engine v2026
          </span>
        </div>
      </div>

    </div>
  );
};
