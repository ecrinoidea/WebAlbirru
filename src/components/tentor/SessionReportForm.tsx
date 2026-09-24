import React, { useState, useEffect } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import {
  AttendanceStatus,
  SESSION_CONFIGS,
  SessionTimeSlot,
  StudentAttendance,
} from '../../types';
import {
  FileText,
  Upload,
  CheckCheck,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Info,
} from 'lucide-react';

interface SessionReportFormProps {
  initialGroupId?: string;
  initialSessionSlot?: string;
  onSuccess: () => void;
}

const PRESET_CLASS_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    title: 'Aktivitas Belajar Menghitung & Kartu Puzzle',
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    title: 'Eksperimen Interaktif & Tanya Jawab Kelompok',
  },
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    title: 'Praktikum Sains & Pengamatan Mandiri',
  },
  {
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    title: 'Diskusi Meja Bundar Bahasa & Membaca',
  },
];

export const SessionReportForm: React.FC<SessionReportFormProps> = ({
  initialGroupId,
  initialSessionSlot,
  onSuccess,
}) => {
  const { currentTentor, groups, submitTeachingReport, showToast } = useBimbel();

  // Find tentor's groups
  const myGroups = groups.filter((g) => g.tentorId === currentTentor.id);
  const defaultGroup = myGroups.find((g) => g.id === initialGroupId) || myGroups[0] || groups[0];

  const [selectedGroupId, setSelectedGroupId] = useState<string>(defaultGroup?.id || '');
  const [selectedSlot, setSelectedSlot] = useState<SessionTimeSlot>(
    (initialSessionSlot as SessionTimeSlot) || defaultGroup?.sessionSlot || 'sesi-1'
  );

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || defaultGroup;

  const [subject, setSubject] = useState<string>(activeGroup?.currentSubject || currentTentor.subjects[0] || '');
  const [topicChapter, setTopicChapter] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  // Attendance state
  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>([]);

  // Class photo state
  const [classPhotoUrl, setClassPhotoUrl] = useState<string>(PRESET_CLASS_PHOTOS[0].url);
  const [photoCaption, setPhotoCaption] = useState('Dokumentasi pemahaman konsep dan pengerjaan modul les.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync attendance list when active group changes
  useEffect(() => {
    if (activeGroup) {
      setSubject(activeGroup.currentSubject);
      setAttendanceList(
        activeGroup.students.map((st) => ({
          studentId: st.id,
          studentName: st.name,
          status: 'Hadir',
          note: 'Aktif menyimak materi dan mampu menyelesaikan tugas.',
        }))
      );
    }
  }, [selectedGroupId, activeGroup]);

  // Mark all students present
  const handleMarkAllPresent = () => {
    setAttendanceList((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'Hadir',
      }))
    );
    showToast('Seluruh siswa ditandai Hadir.', 'info');
  };

  const handleUpdateStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleUpdateNote = (studentId: string, note: string) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, note } : item
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setClassPhotoUrl(event.target.result as string);
          showToast('Foto bukti kelas berhasil diunggah.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicChapter.trim()) {
      showToast('Mohon isi topik atau bab materi yang diajarkan.', 'warning');
      return;
    }
    if (!classPhotoUrl) {
      showToast('Wajib melampirkan foto dokumentasi sesi belajar.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const todayDate = new Date().toISOString().slice(0, 10);

    submitTeachingReport({
      tentorId: currentTentor.id,
      tentorName: currentTentor.name,
      groupId: activeGroup.id,
      groupName: activeGroup.name,
      date: todayDate,
      sessionSlot: selectedSlot,
      subject,
      topicChapter: topicChapter.trim(),
      attendance: attendanceList,
      classPhotoUrl,
      photoCaption: photoCaption.trim(),
      generalNotes: generalNotes.trim() || 'Kelas berjalan tertib dan menyenangkan sesuai target capaian modul.',
      sessionFee: currentTentor.ratePerSession,
    });

    setIsSubmitting(false);
    onSuccess();
  };

  if (!activeGroup) {
    return (
      <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-8 text-center text-xs text-[#081F5C]">
        Tidak ada data kelompok belajar untuk tentor ini.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Form */}
      <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-[#BAD6EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-[#334EAC]" />
            <h3 className="text-base font-bold text-[#081F5C]">
              Formulir Input Laporan Sesi Aktif
            </h3>
          </div>
          <p className="text-xs text-[#081F5C]/75">
            Laporan ini otomatis diteruskan ke admin untuk verifikasi presensi dan pencairan honor sesi Rp {currentTentor.ratePerSession.toLocaleString('id-ID')}.
          </p>
        </div>

        <div className="bg-[#D0E3FF] border border-[#BAD6EB] px-3 py-1.5 rounded-xl text-xs font-bold text-[#081F5C]">
          Honor Sesi: Rp {currentTentor.ratePerSession.toLocaleString('id-ID')}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Session & Subject Metadata */}
        <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-[#BAD6EB] space-y-4">
          <h4 className="text-xs font-bold text-[#081F5C] uppercase tracking-wider flex items-center gap-2 border-b border-[#BAD6EB]/60 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#334EAC]" />
            <span>1. Informasi Sesi Pembelajaran</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Kelompok */}
            <div>
              <label className="block text-xs font-bold text-[#081F5C] mb-1">
                Kelompok Belajar <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC]"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.students.length} Siswa - {g.gradeLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Sesi Jam */}
            <div>
              <label className="block text-xs font-bold text-[#081F5C] mb-1">
                Sesi Jam Mengajar <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value as SessionTimeSlot)}
                className="w-full text-xs px-3 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC]"
              >
                {SESSION_CONFIGS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.timeRange})
                  </option>
                ))}
              </select>
            </div>

            {/* Mapel */}
            <div>
              <label className="block text-xs font-bold text-[#081F5C] mb-1">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Matematika Kreatif"
                className="w-full text-xs px-3 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC]"
                required
              />
            </div>

          </div>

          {/* Topik / Bab Materi */}
          <div>
            <label className="block text-xs font-bold text-[#081F5C] mb-1">
              Topik / Bab Materi yang Diajarkan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topicChapter}
              onChange={(e) => setTopicChapter(e.target.value)}
              placeholder="Contoh: Bab 5: Pengurangan Pecahan Campuran & Pemecahan Soal Cerita Harian"
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC]"
              required
            />
          </div>

          {/* Catatan Umum Sesi */}
          <div>
            <label className="block text-xs font-bold text-[#081F5C] mb-1">
              Rangkuman Dinamika Kelas & Catatan Umum
            </label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Tuliskan suasana kelas, materi yang berhasil dituntaskan, dan pekerjaan rumah jika ada..."
              className="w-full text-xs p-3 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC]"
            />
          </div>

        </div>

        {/* Section 2: Quick Student Attendance & Notes */}
        <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-[#BAD6EB] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#BAD6EB]/60 pb-2">
            <h4 className="text-xs font-bold text-[#081F5C] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#334EAC]" />
              <span>2. Presensi Cepat & Evaluasi Belajar Siswa ({attendanceList.length} Anak)</span>
            </h4>

            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 bg-[#D0E3FF] hover:bg-[#BAD6EB] text-[#081F5C] rounded-lg text-xs font-bold transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#334EAC]" />
              <span>Tandai Semua Hadir</span>
            </button>
          </div>

          <div className="space-y-3">
            {attendanceList.map((att, idx) => (
              <div
                key={att.studentId}
                className="bg-white p-3.5 rounded-xl border border-[#BAD6EB]/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                {/* Student Name */}
                <div className="min-w-[180px]">
                  <span className="font-bold text-[#081F5C] block">
                    {idx + 1}. {att.studentName}
                  </span>
                  <span className="text-[10px] text-[#081F5C]/60">
                    Siswa Albirru #{idx + 1}
                  </span>
                </div>

                {/* Status Segmented Buttons */}
                <div className="flex items-center gap-1 bg-[#F7F2EB] p-1 rounded-xl border border-[#BAD6EB]/60 shrink-0">
                  {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(att.studentId, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        att.status === st
                          ? st === 'Hadir'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : st === 'Izin'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : st === 'Sakit'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-red-600 text-white shadow-2xs'
                          : 'text-[#081F5C]/70 hover:text-[#081F5C]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Individual Evaluation Note */}
                <div className="flex-1 w-full md:w-auto">
                  <input
                    type="text"
                    value={att.note || ''}
                    onChange={(e) => handleUpdateNote(att.studentId, e.target.value)}
                    placeholder="Catatan keaktifan atau pemahaman materi anak..."
                    className="w-full text-xs px-3 py-1.5 bg-[#FFF9F0]/60 border border-[#BAD6EB] rounded-lg text-[#081F5C] focus:ring-1 focus:ring-[#334EAC]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Upload Photo Bukti Kelas */}
        <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-[#BAD6EB] space-y-4">
          <h4 className="text-xs font-bold text-[#081F5C] uppercase tracking-wider flex items-center gap-2 border-b border-[#BAD6EB]/60 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#334EAC]" />
            <span>3. Upload Foto Bukti Dokumentasi Mengajar</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Upload Area & Presets */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#081F5C]">
                Pilih Foto dari Perangkat atau Gunakan Galeri Bukti:
              </label>

              {/* File Input Box */}
              <label className="border-2 border-dashed border-[#7096D1] hover:border-[#334EAC] bg-[#F7F2EB] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <Camera className="w-6 h-6 text-[#334EAC] mb-1" />
                <span className="text-xs font-bold text-[#081F5C]">
                  Klik untuk Unggah Foto Kelas
                </span>
                <span className="text-[10px] text-[#081F5C]/60 mt-0.5">
                  Format JPG, PNG (Maks 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Presets Selection */}
              <div>
                <span className="text-[11px] font-semibold text-[#081F5C]/80 block mb-1.5">
                  Atau pilih dokumentasi simulasi cepat:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_CLASS_PHOTOS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setClassPhotoUrl(preset.url)}
                      className={`p-1.5 rounded-xl border text-left flex items-center gap-2 text-[10px] font-medium transition-all ${
                        classPhotoUrl === preset.url
                          ? 'border-[#334EAC] bg-[#D0E3FF] text-[#081F5C] ring-2 ring-[#334EAC]/30'
                          : 'border-[#BAD6EB] bg-white text-[#081F5C]/70 hover:bg-[#F7F2EB]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt="Thumbnail"
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="truncate">{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-xs font-bold text-[#081F5C] mb-1">
                  Keterangan Foto:
                </label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Keterangan foto dokumentasi..."
                  className="w-full text-xs px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C]"
                />
              </div>

            </div>

            {/* Photo Preview Card */}
            <div className="bg-[#081F5C] p-4 rounded-2xl text-[#FFF9F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-[#BAD6EB]">
                    <ImageIcon className="w-3.5 h-3.5" /> Pratinjau Bukti Terlampir
                  </span>
                  <span className="text-[10px] bg-[#334EAC] px-2 py-0.5 rounded text-white">
                    Siap Verifikasi
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#7096D1]/40 mb-2 relative aspect-video bg-black/30">
                  {classPhotoUrl ? (
                    <img
                      src={classPhotoUrl}
                      alt="Preview Dokumentasi"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#BAD6EB]/60">
                      Belum ada foto yang dipilih
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#FFF9F0]/80 italic">
                  "{photoCaption}"
                </p>
              </div>

              <div className="text-[10px] text-[#BAD6EB] mt-3 pt-2 border-t border-[#7096D1]/30">
                🔒 Bukti ini langsung ditautkan ke akun Admin Pusat Albirru Junior.
              </div>
            </div>

          </div>

        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#334EAC] hover:bg-[#081F5C] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#BAD6EB]" />
            <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Sesi ke Admin'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
