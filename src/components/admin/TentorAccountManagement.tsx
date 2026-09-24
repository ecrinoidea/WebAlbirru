import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { TentorProfile } from '../../types';
import {
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  Lock,
  User,
  Phone,
  Mail,
  Coins,
  CreditCard,
  Building,
  Sparkles,
  Trash2,
  Edit3,
  X,
  Send,
} from 'lucide-react';

const COMMON_SUBJECTS = [
  'Matematika Kreatif',
  'Sains Eksplorasi',
  'Bahasa Inggris Junior',
  'Calistung Ceria',
  'Logika Berhitung',
  'Fisika Dasar',
  'Eksperimen Seru',
  'Storytelling & Grammar',
];

export const TentorAccountManagement: React.FC = () => {
  const {
    tentors,
    registerTentorAccount,
    updateTentorCredentials,
    deleteTentorAccount,
    showToast,
  } = useBimbel();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Password visibility map (tentorId -> boolean)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Copied item indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingTentor, setEditingTentor] = useState<TentorProfile | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRate, setRegRate] = useState<number>(75000);
  const [regBankName, setRegBankName] = useState('Bank Central Asia (BCA)');
  const [regAccountNumber, setRegAccountNumber] = useState('');
  const [regSelectedSubjects, setRegSelectedSubjects] = useState<string[]>([
    'Matematika Kreatif',
    'Sains Eksplorasi',
  ]);
  const [regCustomSubject, setRegCustomSubject] = useState('');
  const [regFormError, setRegFormError] = useState<string | null>(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRate, setEditRate] = useState<number>(75000);
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBank, setEditBank] = useState('');
  const [editAccNum, setEditAccNum] = useState('');

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, identifier: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(identifier);
    showToast(`${label} berhasil disalin ke clipboard!`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyWhatsAppFormat = (tentor: TentorProfile) => {
    const text = `Halo ${tentor.name},\n\nBerikut akun resmi Anda untuk mengakses Portal Pengajar Bimbel Albirru Junior:\n\n🌐 Link Portal: ${window.location.origin}\n👤 Username (USN): ${tentor.username}\n🔑 Kata Sandi (PW): ${tentor.password}\n💰 Honor Per Sesi: Rp ${tentor.ratePerSession.toLocaleString('id-ID')}\n\nSilakan masuk dan lakukan presensi serta pengisian laporan mengajar setiap sesi selesai. Terima kasih atas dedikasinya! ✨\n— Admin Bimbel Albirru Junior`;
    copyToClipboard(text, `wa-${tentor.id}`, 'Format pesan WhatsApp');
  };

  const generateRandomPassword = () => {
    const words = ['bintang', 'kosmik', 'galaksi', 'planet', 'cahaya', 'albirru'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    setRegPassword(`${randomWord}${randomNum}`);
  };

  const handleOpenRegisterModal = () => {
    setRegName('');
    setRegUsername('');
    setRegPassword('');
    setRegTitle('Spesialis Matematika & Sains SD');
    setRegPhone('');
    setRegEmail('');
    setRegRate(75000);
    setRegBankName('Bank Central Asia (BCA)');
    setRegAccountNumber('');
    setRegSelectedSubjects(['Matematika Kreatif', 'Sains Eksplorasi']);
    setRegCustomSubject('');
    setRegFormError(null);
    setIsRegisterModalOpen(true);
  };

  const toggleSubject = (sub: string) => {
    setRegSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (regCustomSubject.trim() && !regSelectedSubjects.includes(regCustomSubject.trim())) {
      setRegSelectedSubjects((prev) => [...prev, regCustomSubject.trim()]);
      setRegCustomSubject('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegFormError(null);

    const res = registerTentorAccount({
      name: regName,
      username: regUsername,
      password: regPassword,
      title: regTitle,
      phone: regPhone || '0812-0000-0000',
      email: regEmail || `${regUsername.toLowerCase()}@albirru.sch.id`,
      subjects: regSelectedSubjects,
      ratePerSession: regRate,
      bankName: regBankName,
      accountNumber: regAccountNumber,
    });

    if (res.success) {
      setIsRegisterModalOpen(false);
    } else {
      setRegFormError(res.message);
    }
  };

  const handleOpenEditModal = (t: TentorProfile) => {
    setEditingTentor(t);
    setEditName(t.name);
    setEditPassword(t.password);
    setEditRate(t.ratePerSession);
    setEditPhone(t.phone);
    setEditEmail(t.email);
    setEditBank(t.bankName || 'Bank Central Asia (BCA)');
    setEditAccNum(t.accountNumber || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTentor) return;

    updateTentorCredentials(editingTentor.id, {
      name: editName,
      password: editPassword,
      ratePerSession: editRate,
      phone: editPhone,
      email: editEmail,
      bankName: editBank,
      accountNumber: editAccNum,
    });

    setEditingTentor(null);
  };

  const filteredTentors = tentors.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-[#081F5C] via-[#334EAC] to-[#081F5C] rounded-2xl p-6 text-[#FFF9F0] shadow-sm border border-[#7096D1]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold tracking-tight text-[#FFF9F0]">
              Manajemen Akun & Kredensial Tentor
            </h2>
            <span className="text-[11px] font-bold text-[#BAD6EB] bg-[#334EAC]/80 px-2 py-0.5 rounded border border-[#7096D1]/40">
              {tentors.length} Tentor Terdaftar
            </span>
          </div>
          <p className="text-xs text-[#BAD6EB] max-w-2xl leading-relaxed">
            Admin memiliki wewenang penuh untuk mendaftarkan akun baru bagi tentor (username dan password), mereset kata sandi, mengatur besaran honor per sesi, serta menyalin kredensial untuk dikirimkan ke tentor.
          </p>
        </div>

        <button
          onClick={handleOpenRegisterModal}
          className="flex items-center justify-center gap-2 bg-[#BAD6EB] hover:bg-[#D0E3FF] text-[#081F5C] px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Daftarkan Akun Tentor Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#BAD6EB] shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7096D1]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama tentor, username (usn), atau mata pelajaran..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F2EB] border border-[#BAD6EB] rounded-xl text-xs font-medium text-[#081F5C] placeholder:text-[#081F5C]/40 focus:outline-none focus:border-[#334EAC] focus:bg-white"
          />
        </div>

        <div className="text-xs text-[#081F5C]/75 font-medium self-end sm:self-auto">
          Menampilkan <strong className="text-[#081F5C]">{filteredTentors.length}</strong> dari {tentors.length} akun tentor
        </div>
      </div>

      {/* Tentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTentors.map((tentor) => {
          const isPassVisible = !!visiblePasswords[tentor.id];
          const isWaCopied = copiedId === `wa-${tentor.id}`;
          const isUsnCopied = copiedId === `usn-${tentor.id}`;
          const isPwCopied = copiedId === `pw-${tentor.id}`;

          return (
            <div
              key={tentor.id}
              className="bg-white rounded-2xl border border-[#BAD6EB] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Row */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#BAD6EB]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#334EAC] to-[#081F5C] border border-[#7096D1] flex items-center justify-center font-bold text-sm text-[#FFF9F0] shadow-2xs">
                      {tentor.name.split(' ')[1]?.[0] || 'T'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#081F5C] leading-tight">
                        {tentor.name}
                      </h3>
                      <p className="text-[11px] text-[#334EAC] font-medium mt-0.5">
                        {tentor.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#081F5C]/60">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#7096D1]" />
                          {tentor.phone}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#7096D1]" />
                          {tentor.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    Aktif
                  </span>
                </div>

                {/* Credentials Box (USN & PW) */}
                <div className="mt-3.5 bg-[#F7F2EB] p-3 rounded-xl border border-[#BAD6EB] space-y-2">
                  <div className="text-[10px] font-bold text-[#081F5C]/75 uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-[#334EAC]" />
                    <span>Kredensial Masuk Portal Tentor</span>
                  </div>

                  {/* Username Row */}
                  <div className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-lg border border-[#BAD6EB]/80">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#081F5C]/60 w-24">Username (USN):</span>
                      <code className="font-mono font-bold text-[#081F5C] bg-[#D0E3FF] px-2 py-0.5 rounded text-xs">
                        {tentor.username}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(tentor.username, `usn-${tentor.id}`, 'Username')}
                      className="p-1 text-[#7096D1] hover:text-[#081F5C] hover:bg-[#F7F2EB] rounded transition-colors"
                      title="Salin Username"
                    >
                      {isUsnCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password Row */}
                  <div className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-lg border border-[#BAD6EB]/80">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#081F5C]/60 w-24">Password (PW):</span>
                      <code className="font-mono font-bold text-[#081F5C] bg-[#BAD6EB]/40 px-2 py-0.5 rounded text-xs">
                        {isPassVisible ? tentor.password : '••••••••'}
                      </code>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePasswordVisibility(tentor.id)}
                        className="p-1 text-[#7096D1] hover:text-[#081F5C] hover:bg-[#F7F2EB] rounded transition-colors"
                        title={isPassVisible ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                      >
                        {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(tentor.password, `pw-${tentor.id}`, 'Password')}
                        className="p-1 text-[#7096D1] hover:text-[#081F5C] hover:bg-[#F7F2EB] rounded transition-colors"
                        title="Salin Kata Sandi"
                      >
                        {isPwCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financial & Subjects Info */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FFF9F0] p-2.5 rounded-xl border border-[#BAD6EB]">
                    <span className="text-[10px] text-[#081F5C]/60 font-semibold block">Honor Per Sesi:</span>
                    <span className="font-bold text-[#081F5C] text-xs">
                      Rp {tentor.ratePerSession.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-[#FFF9F0] p-2.5 rounded-xl border border-[#BAD6EB]">
                    <span className="text-[10px] text-[#081F5C]/60 font-semibold block">Rekening Transfer:</span>
                    <span className="font-medium text-[#081F5C] text-[11px] truncate block">
                      {tentor.bankName ? tentor.bankName.split(' ')[0] : 'Bank'} - {tentor.accountNumber || '-'}
                    </span>
                  </div>
                </div>

                {/* Subjects tags */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-[#081F5C]/60 block mb-1">Mata Pelajaran:</span>
                  <div className="flex flex-wrap gap-1">
                    {tentor.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-[#334EAC] bg-[#D0E3FF]/60 px-2 py-0.5 rounded-md border border-[#BAD6EB]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#BAD6EB]/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => copyWhatsAppFormat(tentor)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg transition-all"
                  title="Salin template pesan WhatsApp berisi username & password tentor"
                >
                  {isWaCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isWaCopied ? 'Tersalin!' : 'Kirim WA'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(tentor)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#334EAC] hover:text-[#081F5C] bg-[#D0E3FF]/40 hover:bg-[#D0E3FF] border border-[#BAD6EB] px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Kredensial</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus akun tentor "${tentor.name}"?`)) {
                        deleteTentorAccount(tentor.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
                    title="Hapus Akun Tentor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Register New Tentor Account */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] border border-[#7096D1] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#BAD6EB]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#334EAC] text-[#FFF9F0] flex items-center justify-center shadow-sm">
                  <UserPlus className="w-5 h-5 text-[#BAD6EB]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#081F5C]">
                    Daftarkan Akun Tentor Baru
                  </h3>
                  <p className="text-[11px] text-[#081F5C]/70">
                    Buat akun login berisi username & kata sandi resmi Bimbel Albirru Junior
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 text-[#081F5C]/60 hover:text-[#081F5C] rounded-lg hover:bg-[#BAD6EB]/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regFormError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {regFormError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-4 text-xs">
              
              {/* Account Credentials Box */}
              <div className="p-4 bg-white rounded-2xl border border-[#334EAC]/30 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#081F5C] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#334EAC]" />
                    Kredensial Akun (Login)
                  </span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[10px] font-bold text-[#334EAC] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#7096D1]" />
                    Acak Password Otomatis
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                      Username (USN) *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7096D1]" />
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        placeholder="contoh: nabila / zahra"
                        className="w-full pl-8 pr-3 py-2 bg-[#F7F2EB] border border-[#BAD6EB] rounded-xl font-mono text-xs font-bold text-[#081F5C] focus:bg-white focus:outline-none focus:border-[#334EAC]"
                      />
                    </div>
                    <span className="text-[10px] text-[#081F5C]/60 mt-0.5 block">
                      Huruf kecil tanpa spasi. Digunakan untuk login tentor.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                      Kata Sandi (PW) *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7096D1]" />
                      <input
                        type="text"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 4 karakter"
                        className="w-full pl-8 pr-3 py-2 bg-[#F7F2EB] border border-[#BAD6EB] rounded-xl font-mono text-xs font-bold text-[#081F5C] focus:bg-white focus:outline-none focus:border-[#334EAC]"
                      />
                    </div>
                    <span className="text-[10px] text-[#081F5C]/60 mt-0.5 block">
                      Dapat diubah atau direset admin kapan saja.
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Kak Nabila Putri, S.Pd."
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Spesialisasi / Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    placeholder="Contoh: Spesialis Matematika Ceria SD"
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>
              </div>

              {/* Contact & Honor Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Email Tentor
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tentor@albirru.sch.id"
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Honor Per Sesi (Rp) *
                  </label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={regRate}
                    onChange={(e) => setRegRate(Number(e.target.value))}
                    placeholder="75000"
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>
              </div>

              {/* Bank & Rekening */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Nama Bank Pencairan Honor
                  </label>
                  <input
                    type="text"
                    value={regBankName}
                    onChange={(e) => setRegBankName(e.target.value)}
                    placeholder="Contoh: Bank Central Asia (BCA)"
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={regAccountNumber}
                    onChange={(e) => setRegAccountNumber(e.target.value)}
                    placeholder="Contoh: 1234567890"
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] focus:outline-none focus:border-[#334EAC]"
                  />
                </div>
              </div>

              {/* Subjects selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#081F5C] mb-1.5">
                  Mata Pelajaran yang Diampu
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_SUBJECTS.map((sub) => {
                    const isSelected = regSelectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#334EAC] text-[#FFF9F0] border-[#334EAC]'
                            : 'bg-white text-[#081F5C] border-[#BAD6EB] hover:border-[#334EAC]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-[#BAD6EB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#081F5C]/70 hover:bg-[#BAD6EB]/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#FFF9F0] bg-[#334EAC] hover:bg-[#081F5C] shadow-md transition-all cursor-pointer"
                >
                  Simpan & Daftarkan Akun
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: Edit Tentor Credentials */}
      {editingTentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] border border-[#7096D1] rounded-3xl max-w-md w-full p-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#BAD6EB]">
              <div>
                <h3 className="text-base font-bold text-[#081F5C]">
                  Edit Kredensial & Profil Tentor
                </h3>
                <p className="text-[11px] text-[#081F5C]/70">
                  Perbarui kata sandi atau data tentor: {editingTentor.name}
                </p>
              </div>

              <button
                onClick={() => setEditingTentor(null)}
                className="p-1.5 text-[#081F5C]/60 hover:text-[#081F5C] rounded-lg hover:bg-[#BAD6EB]/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3 text-xs">
              
              <div className="p-3 bg-white rounded-xl border border-[#BAD6EB]">
                <span className="text-[10px] font-bold text-[#081F5C]/60 block mb-1">Username (Tetap / Tidak Diubah):</span>
                <code className="font-mono font-bold text-xs text-[#081F5C] bg-[#D0E3FF] px-2 py-0.5 rounded">
                  {editingTentor.username}
                </code>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                  Nama Lengkap Tentor
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                  Kata Sandi (PW) Baru
                </label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl font-mono text-xs font-bold text-[#081F5C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Honor Per Sesi (Rp)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    Bank
                  </label>
                  <input
                    type="text"
                    value={editBank}
                    onChange={(e) => setEditBank(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#081F5C] mb-1">
                    No. Rekening
                  </label>
                  <input
                    type="text"
                    value={editAccNum}
                    onChange={(e) => setEditAccNum(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#BAD6EB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTentor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#081F5C]/70 hover:bg-[#BAD6EB]/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#FFF9F0] bg-[#334EAC] hover:bg-[#081F5C] shadow-md transition-all cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
