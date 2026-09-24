import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { StudyGroup, SESSION_CONFIGS } from '../../types';
import { ParentMessageModal } from './ParentMessageModal';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const AssignedGroups: React.FC = () => {
  const { currentTentor, groups } = useBimbel();

  const myGroups = groups.filter((g) => g.tentorId === currentTentor.id);
  const [selectedGroupForMessage, setSelectedGroupForMessage] = useState<StudyGroup | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Banner Header */}
      <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-[#BAD6EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-[#334EAC]" />
            <h3 className="text-base font-bold text-[#081F5C]">
              Daftar Kelompok Belajar Asuhan Anda
            </h3>
          </div>
          <p className="text-xs text-[#081F5C]/75">
            Pantau perkembangan kurikulum tiap kelompok dan gunakan pintasan pesan untuk mengabari wali murid.
          </p>
        </div>

        <div className="bg-[#D0E3FF] border border-[#BAD6EB] px-3 py-1.5 rounded-xl text-xs font-bold text-[#081F5C]">
          {myGroups.length} Kelompok Belajar
        </div>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myGroups.map((group) => {
          const sessionInfo = SESSION_CONFIGS.find((s) => s.id === group.sessionSlot);

          return (
            <div
              key={group.id}
              className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-5 shadow-xs hover:border-[#7096D1] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#334EAC]" />
                      <h4 className="text-base font-bold text-[#081F5C]">
                        {group.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[#334EAC] font-semibold">
                      {group.gradeLevel} · {group.currentSubject}
                    </p>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D0E3FF] text-[#081F5C] border border-[#BAD6EB]">
                    {group.students.length} / {group.maxCapacity} Siswa
                  </span>
                </div>

                {/* Schedule Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-[#081F5C]/80 mb-4 bg-[#F7F2EB] p-3 rounded-xl border border-[#BAD6EB]/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#334EAC]" />
                    <span>{group.scheduleDay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#334EAC]" />
                    <span>{sessionInfo?.timeRange}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#334EAC]" />
                    <span>{group.room}</span>
                  </div>
                </div>

                {/* Curriculum Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[#081F5C] mb-1.5">
                    <span className="font-semibold flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#334EAC]" /> Capaian Kurikulum Semester
                    </span>
                    <span className="font-bold tabular-nums text-[#334EAC]">
                      {group.completedTopicsCount} / {group.totalTopicsCount} Bab ({group.curriculumProgress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#BAD6EB]/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#334EAC] to-[#7096D1] rounded-full"
                      style={{ width: `${group.curriculumProgress}%` }}
                    />
                  </div>
                </div>

                {/* Student Chips */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-bold text-[#081F5C] block">
                    Siswa Terdaftar ({group.students.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.students.map((student) => (
                      <span
                        key={student.id}
                        className="bg-white border border-[#BAD6EB] px-2.5 py-1 rounded-lg text-[11px] text-[#081F5C] font-medium"
                      >
                        {student.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#BAD6EB]/60 flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#081F5C]/70">
                  Konsultasi Wali Aktif
                </span>

                <button
                  onClick={() => setSelectedGroupForMessage(group)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim Pesan / WhatsApp Wali</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Broadcast / Communication */}
      {selectedGroupForMessage && (
        <ParentMessageModal
          isOpen={!!selectedGroupForMessage}
          onClose={() => setSelectedGroupForMessage(null)}
          group={selectedGroupForMessage}
          tentorName={currentTentor.name}
        />
      )}

    </div>
  );
};
