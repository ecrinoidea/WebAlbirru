import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { StudyGroup, SESSION_CONFIGS } from '../../types';
import { AddStudentModal } from './AddStudentModal';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Phone,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const GroupManagement: React.FC = () => {
  const { groups, removeStudentFromGroup } = useBimbel();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCapacity, setFilterCapacity] = useState<'all' | 'available' | 'full'>('all');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [selectedGroupForAdd, setSelectedGroupForAdd] = useState<StudyGroup | null>(null);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.currentSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.students.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const isFull = group.students.length >= group.maxCapacity;
    if (filterCapacity === 'available' && isFull) return false;
    if (filterCapacity === 'full' && !isFull) return false;

    return matchesSearch;
  });

  const toggleExpand = (groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Search, Filter, and Group Stats */}
      <div className="bg-[#FFF9F0] p-4 rounded-2xl border border-[#BAD6EB]/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7096D1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kelompok, tentor, mata pelajaran, atau siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] placeholder:text-[#081F5C]/50 focus:outline-none focus:ring-2 focus:ring-[#334EAC]"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-[#F7F2EB] p-1 rounded-xl border border-[#BAD6EB]/60 shrink-0">
          <button
            onClick={() => setFilterCapacity('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterCapacity === 'all'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:text-[#334EAC]'
            }`}
          >
            Semua ({groups.length})
          </button>
          <button
            onClick={() => setFilterCapacity('available')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterCapacity === 'available'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:text-[#334EAC]'
            }`}
          >
            Kursi Tersedia ({groups.filter((g) => g.students.length < g.maxCapacity).length})
          </button>
          <button
            onClick={() => setFilterCapacity('full')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterCapacity === 'full'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:text-[#334EAC]'
            }`}
          >
            Penuh 6/6 ({groups.filter((g) => g.students.length >= g.maxCapacity).length})
          </button>
        </div>

      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          const currentCount = group.students.length;
          const isFull = currentCount >= group.maxCapacity;
          const remainingSeats = group.maxCapacity - currentCount;
          const sessionInfo = SESSION_CONFIGS.find((s) => s.id === group.sessionSlot);
          const isExpanded = expandedGroupId === group.id;

          // Capacity Badge Style
          let capacityBadge = {
            text: `Slot Terbuka (${currentCount}/${group.maxCapacity})`,
            classes: 'bg-[#D0E3FF] text-[#081F5C] border-[#BAD6EB]',
          };
          if (isFull) {
            capacityBadge = {
              text: 'Penuh (6/6)',
              classes: 'bg-red-50 text-red-700 border-red-200',
            };
          } else if (remainingSeats === 1) {
            capacityBadge = {
              text: 'Sisa 1 Kursi!',
              classes: 'bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse',
            };
          }

          return (
            <div
              key={group.id}
              className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#334EAC]" />
                      <h3 className="text-base font-bold text-[#081F5C]">
                        {group.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#081F5C]/70 font-medium">
                      {group.gradeLevel} · {group.currentSubject}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${capacityBadge.classes}`}
                  >
                    {capacityBadge.text}
                  </span>
                </div>

                {/* Seat Visualizer (6 dots/seats) */}
                <div className="bg-[#F7F2EB] p-2.5 rounded-xl border border-[#BAD6EB]/50 mb-3.5">
                  <div className="flex items-center justify-between text-xs text-[#081F5C] mb-1.5 font-medium">
                    <span>Formasi Kursi Belajar:</span>
                    <span className="font-bold tabular-nums">
                      {currentCount} / {group.maxCapacity} Siswa
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {Array.from({ length: group.maxCapacity }).map((_, idx) => {
                      const isOccupied = idx < currentCount;
                      const student = group.students[idx];
                      return (
                        <div
                          key={idx}
                          title={student ? `${student.name} (${student.schoolGrade})` : 'Kursi Kosong'}
                          className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                            isOccupied
                              ? 'bg-[#334EAC] text-white shadow-2xs'
                              : 'bg-white border border-dashed border-[#7096D1] text-[#7096D1]'
                          }`}
                        >
                          {isOccupied ? `K${idx + 1}` : 'Free'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Metadata */}
                <div className="space-y-2 text-xs text-[#081F5C] mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#334EAC] shrink-0" />
                    <span>
                      Tentor Pendamping: <strong className="font-semibold text-[#081F5C]">{group.tentorName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#334EAC] shrink-0" />
                    <span>
                      Jadwal Les: <strong className="font-semibold text-[#081F5C]">{group.scheduleDay}</strong> ({sessionInfo?.timeRange})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#334EAC] shrink-0" />
                    <span>
                      Lokasi: <span className="font-medium text-[#081F5C]/80">{group.room}</span>
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] text-[#081F5C]/80 mb-1">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#334EAC]" /> Capaian Kurikulum:
                      </span>
                      <span className="font-bold tabular-nums text-[#081F5C]">
                        {group.completedTopicsCount}/{group.totalTopicsCount} Bab ({group.curriculumProgress}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#BAD6EB]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#334EAC] to-[#7096D1] rounded-full"
                        style={{ width: `${group.curriculumProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#BAD6EB]/60 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedGroupForAdd(group)}
                    disabled={isFull}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      isFull
                        ? 'bg-[#F7F2EB] text-[#081F5C]/40 border border-[#BAD6EB]/40 cursor-not-allowed'
                        : 'bg-[#334EAC] hover:bg-[#081F5C] text-white shadow-xs'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isFull ? 'Kuota Penuh' : '+ Daftar Siswa Baru'}</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(group.id)}
                    className="p-2 bg-[#F7F2EB] hover:bg-[#BAD6EB]/40 border border-[#BAD6EB] rounded-xl text-[#081F5C] transition-colors"
                    title={isExpanded ? 'Tutup daftar siswa' : 'Lihat siswa di kelompok ini'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Student List */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#BAD6EB]/50 space-y-2 bg-[#F7F2EB]/50 p-2.5 rounded-xl">
                    <div className="text-[11px] font-bold text-[#081F5C] flex items-center justify-between">
                      <span>Daftar Siswa Terdaftar ({group.students.length}):</span>
                      <span className="text-[10px] text-[#334EAC] font-medium">Bimbel Albirru</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {group.students.map((student, sIdx) => (
                        <div
                          key={student.id}
                          className="bg-white p-2 rounded-lg border border-[#BAD6EB]/60 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#081F5C]">
                              {sIdx + 1}. {student.name}
                            </div>
                            <div className="text-[10px] text-[#081F5C]/70">
                              {student.schoolGrade} · Wali: {student.parentName}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/62${student.parentPhone.replace(/[^0-9]/g, '').slice(1)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title={`Chat WA Wali: ${student.parentPhone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => removeStudentFromGroup(group.id, student.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Hapus dari kelompok"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Add Student */}
      <AddStudentModal
        isOpen={!!selectedGroupForAdd}
        onClose={() => setSelectedGroupForAdd(null)}
        targetGroup={selectedGroupForAdd}
      />

    </div>
  );
};
