import React, { useState } from 'react';
import { StudyGroup, Student } from '../../types';
import { X, Send, Copy, Check, MessageCircle, Sparkles } from 'lucide-react';
import { useBimbel } from '../../context/BimbelContext';

interface ParentMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: StudyGroup;
  tentorName: string;
}

export const ParentMessageModal: React.FC<ParentMessageModalProps> = ({
  isOpen,
  onClose,
  group,
  tentorName,
}) => {
  const { showToast } = useBimbel();
  const [selectedStudent, setSelectedStudent] = useState<Student | 'all'>('all');
  const [templateType, setTemplateType] = useState<'progress' | 'reminder' | 'appreciation'>('progress');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetName = selectedStudent === 'all' ? 'Ayah/Bunda Siswa' : `Bunda/Ayah ${selectedStudent.name}`;
  const studentSubject = group.currentSubject;

  let messageText = '';
  if (templateType === 'progress') {
    messageText = `Assalamu'alaikum wr. wb., Selamat sore ${targetName}.\n\nKami dari Bimbel Albirru Junior ingin menginformasikan perkembangan belajar ananda di ${group.name} pada mata pelajaran ${studentSubject}. Ananda telah menyelesaikan materi dengan baik dan capaian kurikulum kelompok kini telah mencapai ${group.curriculumProgress}%.\n\nTerima kasih atas dukungannya di rumah.\n\nSalam hangat,\n${tentorName}\nTentor Pendamping Albirru Junior`;
  } else if (templateType === 'reminder') {
    messageText = `Assalamu'alaikum wr. wb., Mengingatkan ${targetName} bahwa jadwal les ${group.name} (${studentSubject}) akan berlangsung besok (${group.scheduleDay}) di ${group.room}. Mohon ananda membawa buku modul dan perlengkapan belajar. Terima kasih!\n\nSalam,\n${tentorName}`;
  } else {
    messageText = `Assalamu'alaikum wr. wb., Apresiasi setinggi-tingginya untuk keaktifan ananda di ${group.name} hari ini! Ananda sangat fokus, percaya diri dalam menyelesaikan soal tantangan, dan aktif dalam berdiskusi.\n\nSemoga terus bersemangat!\n${tentorName} - Bimbel Albirru Junior`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    showToast('Teks pesan berhasil disalin ke papan klip!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsapp = () => {
    let phone = '';
    if (selectedStudent !== 'all' && selectedStudent.parentPhone) {
      phone = selectedStudent.parentPhone.replace(/[^0-9]/g, '');
      if (phone.startsWith('0')) {
        phone = '62' + phone.slice(1);
      }
    }
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFF9F0] w-full max-w-lg rounded-2xl border border-[#7096D1] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#081F5C] px-6 py-4 flex items-center justify-between text-[#FFF9F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#334EAC] flex items-center justify-center text-[#BAD6EB]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#FFF9F0]">
                Pintasan Komunikasi Wali Murid
              </h3>
              <p className="text-xs text-[#BAD6EB]">
                {group.name} · {group.students.length} Siswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="text-[#BAD6EB] hover:text-[#FFF9F0] p-1 rounded-lg hover:bg-[#334EAC]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-[#081F5C]">
          
          {/* Target Recipient */}
          <div>
            <label className="block font-bold mb-1">Kirim Ke:</label>
            <select
              value={typeof selectedStudent === 'string' ? selectedStudent : selectedStudent.id}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setSelectedStudent('all');
                } else {
                  const s = group.students.find((st) => st.id === e.target.value);
                  if (s) setSelectedStudent(s);
                }
              }}
              className="w-full text-xs px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC] focus:outline-none"
            >
              <option value="all">Broadcast Semua Wali Murid ({group.students.length} Siswa)</option>
              {group.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Wali: {s.parentName} · {s.parentPhone})
                </option>
              ))}
            </select>
          </div>

          {/* Template Choice */}
          <div>
            <label className="block font-bold mb-1">Pilih Templat Pesan:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('progress')}
                className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                  templateType === 'progress'
                    ? 'bg-[#334EAC] text-white border-[#081F5C] shadow-xs'
                    : 'bg-white text-[#081F5C] border-[#BAD6EB] hover:bg-[#F7F2EB]'
                }`}
              >
                Progres Capaian
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('reminder')}
                className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                  templateType === 'reminder'
                    ? 'bg-[#334EAC] text-white border-[#081F5C] shadow-xs'
                    : 'bg-white text-[#081F5C] border-[#BAD6EB] hover:bg-[#F7F2EB]'
                }`}
              >
                Pengingat Jadwal
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('appreciation')}
                className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                  templateType === 'appreciation'
                    ? 'bg-[#334EAC] text-white border-[#081F5C] shadow-xs'
                    : 'bg-white text-[#081F5C] border-[#BAD6EB] hover:bg-[#F7F2EB]'
                }`}
              >
                Apresiasi Belajar
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1 text-[#334EAC]">
                <Sparkles className="w-3.5 h-3.5" /> Pratinjau Pesan WhatsApp:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-[#081F5C] hover:text-[#334EAC] flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={7}
              value={messageText}
              className="w-full p-3 bg-white border border-[#BAD6EB] rounded-xl text-xs text-[#081F5C] focus:outline-none font-sans whitespace-pre-line"
            />
          </div>

          {/* Action */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#081F5C] hover:bg-[#F7F2EB] rounded-xl"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSendWhatsapp}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka di WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
