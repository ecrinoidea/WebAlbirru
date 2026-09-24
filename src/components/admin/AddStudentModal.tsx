import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { StudyGroup } from '../../types';
import { X, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGroup: StudyGroup | null;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  targetGroup,
}) => {
  const { addStudentToGroup } = useBimbel();

  const [name, setName] = useState('');
  const [schoolGrade, setSchoolGrade] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !targetGroup) return null;

  const currentCount = targetGroup.students.length;
  const isFull = currentCount >= targetGroup.maxCapacity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama siswa wajib diisi');
      return;
    }
    if (!schoolGrade.trim()) {
      setErrorMsg('Kelas & nama sekolah wajib diisi');
      return;
    }
    if (!parentName.trim()) {
      setErrorMsg('Nama orang tua/wali wajib diisi');
      return;
    }
    if (!parentPhone.trim()) {
      setErrorMsg('Nomor WhatsApp orang tua wajib diisi');
      return;
    }

    const success = addStudentToGroup(targetGroup.id, {
      name: name.trim(),
      schoolGrade: schoolGrade.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      avatarSeed: name.toLowerCase().replace(/\s+/g, ''),
    });

    if (success) {
      setName('');
      setSchoolGrade('');
      setParentName('');
      setParentPhone('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFF9F0] w-full max-w-lg rounded-2xl border border-[#7096D1] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#081F5C] px-6 py-4 flex items-center justify-between text-[#FFF9F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#334EAC] flex items-center justify-center text-[#BAD6EB]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#FFF9F0]">
                Pendaftaran Siswa Baru
              </h3>
              <p className="text-xs text-[#BAD6EB]">
                {targetGroup.name} · {targetGroup.gradeLevel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-[#BAD6EB] hover:text-[#FFF9F0] p-1 rounded-lg hover:bg-[#334EAC]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Capacity Notice */}
          <div className="p-3 bg-[#F7F2EB] rounded-xl border border-[#BAD6EB] flex items-center justify-between">
            <span className="text-xs text-[#081F5C] font-medium">
              Kapasitas Kursi Kelas:
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isFull ? 'bg-red-100 text-red-700' : 'bg-[#D0E3FF] text-[#081F5C]'
            }`}>
              {currentCount} / {targetGroup.maxCapacity} Kursi Terisi
            </span>
          </div>

          {isFull ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Kelompok ini telah mencapai batas kuota maksimal (6 siswa per kelompok). Silakan pilih kelompok lain atau buat kelompok baru.
              </span>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#081F5C] mb-1">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Raditya Danendra Putra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:outline-none focus:ring-2 focus:ring-[#334EAC]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081F5C] mb-1">
                  Asal Sekolah & Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelas 5 SDN Menteng 01"
                  value={schoolGrade}
                  onChange={(e) => setSchoolGrade(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:outline-none focus:ring-2 focus:ring-[#334EAC]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#081F5C] mb-1">
                    Nama Orang Tua / Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Rini Wulandari"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:outline-none focus:ring-2 focus:ring-[#334EAC]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#081F5C] mb-1">
                    No. WhatsApp Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 0812-3456-7890"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:outline-none focus:ring-2 focus:ring-[#334EAC]"
                    required
                  />
                </div>
              </div>

              <div className="bg-[#D0E3FF]/30 p-3 rounded-xl border border-[#BAD6EB] text-xs text-[#081F5C] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#334EAC]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sistem Otomatis Albirru Junior:</span>
                </div>
                <p className="text-[11px] text-[#081F5C]/80">
                  Pendaftaran ini otomatis menerbitkan tagihan SPP September 2026 sebesar Rp 350.000 dan menautkan data presensi pada sesi kelompok terkait.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#081F5C] hover:bg-[#F7F2EB] rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#334EAC] hover:bg-[#081F5C] rounded-xl shadow-sm transition-all"
                >
                  Simpan & Daftarkan Siswa
                </button>
              </div>
            </>
          )}

          {isFull && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#081F5C] rounded-xl"
              >
                Tutup
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
