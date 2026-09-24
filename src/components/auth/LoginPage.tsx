import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, tentors } = useBimbel();

  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password, selectedRoleTab);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRoleTab(role);
    setErrorMessage(null);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      // Pick first tentor as default
      const defaultTentor = tentors[0];
      setUsername(defaultTentor ? defaultTentor.username : 'sarah');
      setPassword(defaultTentor ? defaultTentor.password : 'sarah123');
    }
  };

  const quickFill = (u: string, p: string, r: UserRole) => {
    setSelectedRoleTab(r);
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081F5C] via-[#102a70] to-[#334EAC] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Decorative Cosmic background circles */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-[#7096D1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#BAD6EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#334EAC]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-[#7096D1]/40 bg-[#FFF9F0]">
        
        {/* Left Col: Hero Branding & Cosmic Identity */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#081F5C] to-[#1e3a8a] text-[#FFF9F0] p-8 sm:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#334EAC]/50">
          {/* Subtle star pattern glow */}
          <div className="absolute top-6 right-6 flex items-center gap-1.5 text-xs font-semibold text-[#BAD6EB] bg-[#334EAC]/60 px-3 py-1 rounded-full border border-[#7096D1]/40 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#BAD6EB]" />
            <span>Albirru Junior</span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#334EAC] to-[#081F5C] border-2 border-[#7096D1] flex items-center justify-center shadow-lg text-[#FFF9F0] mb-6 relative">
              <Sparkles className="w-7 h-7 text-[#BAD6EB]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D0E3FF] rounded-full blur-xs" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-[#FFF9F0]">
              Portal Masuk Terpadu
            </h1>
            <p className="text-xs text-[#BAD6EB] font-medium mt-1">
              Bimbingan Belajar Kosmik Berprestasi
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3 bg-[#334EAC]/30 p-3 rounded-xl border border-[#7096D1]/30">
                <CheckCircle2 className="w-4 h-4 text-[#BAD6EB] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#FFF9F0] block">Maksimal 6 Siswa / Kelompok</span>
                  <span className="text-[#BAD6EB]/80">Fokus intensif & pendampingan terarah untuk capaian terbaik anak.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#334EAC]/30 p-3 rounded-xl border border-[#7096D1]/30">
                <CheckCircle2 className="w-4 h-4 text-[#BAD6EB] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#FFF9F0] block">Pusat Kendali Jadwal & Honor</span>
                  <span className="text-[#BAD6EB]/80">Sinkronisasi presensi, laporan mengajar berfoto, dan transparansi honorarium.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#334EAC]/30 p-3 rounded-xl border border-[#7096D1]/30">
                <CheckCircle2 className="w-4 h-4 text-[#BAD6EB] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#FFF9F0] block">Pendaftaran Akun Tentor Mandiri</span>
                  <span className="text-[#BAD6EB]/80">Admin dapat mendaftarkan kredensial (USN & PW) bagi tentor baru kapan saja.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#334EAC]/60 flex items-center justify-between text-[11px] text-[#BAD6EB]/70">
            <span>© 2026 Bimbel Albirru Junior</span>
            <span>Versi 2.4.0</span>
          </div>
        </div>

        {/* Right Col: Login Form & Demo Credentials */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#FFF9F0]">
          
          <div>
            {/* Header info */}
            <div className="mb-6">
              <span className="text-xs font-bold tracking-wider text-[#334EAC] uppercase block">
                Selamat Datang
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#081F5C] tracking-tight">
                Masuk ke Akun Anda
              </h2>
              <p className="text-xs text-[#081F5C]/70 mt-1">
                Silakan pilih peran dan masukkan username serta kata sandi terdaftar.
              </p>
            </div>

            {/* Role Tab Selector */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#BAD6EB]/40 rounded-2xl border border-[#BAD6EB] mb-6">
              <button
                type="button"
                onClick={() => handleRoleTabChange('admin')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  selectedRoleTab === 'admin'
                    ? 'bg-[#081F5C] text-[#FFF9F0] shadow-md border border-[#334EAC]'
                    : 'text-[#081F5C]/80 hover:bg-[#BAD6EB]/60 hover:text-[#081F5C]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#BAD6EB]" />
                <span>Admin Bimbel</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange('tentor')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  selectedRoleTab === 'tentor'
                    ? 'bg-[#334EAC] text-[#FFF9F0] shadow-md border border-[#7096D1]'
                    : 'text-[#081F5C]/80 hover:bg-[#BAD6EB]/60 hover:text-[#081F5C]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#BAD6EB]" />
                <span>Tentor Pengajar</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-[#081F5C] mb-1.5">
                  Username (USN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7096D1]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={selectedRoleTab === 'admin' ? 'admin' : 'Contoh: sarah / fauzan'}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] placeholder:text-[#081F5C]/40 focus:outline-none focus:border-[#334EAC] focus:ring-2 focus:ring-[#334EAC]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#081F5C]">
                    Kata Sandi (PW)
                  </label>
                  {selectedRoleTab === 'tentor' && (
                    <span className="text-[11px] text-[#334EAC] font-medium">
                      Lupa? Hubungi Admin Bimbel
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7096D1]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-11 py-2.5 bg-white border border-[#BAD6EB] rounded-xl text-xs font-semibold text-[#081F5C] placeholder:text-[#081F5C]/40 focus:outline-none focus:border-[#334EAC] focus:ring-2 focus:ring-[#334EAC]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7096D1] hover:text-[#081F5C] transition-colors"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#FFF9F0] bg-gradient-to-r from-[#081F5C] via-[#334EAC] to-[#081F5C] hover:opacity-95 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Memverifikasi kredensial...</span>
                ) : (
                  <>
                    <span>Masuk ke {selectedRoleTab === 'admin' ? 'Dashboard Admin' : 'Dashboard Tentor'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo Credentials for Instant User Testing */}
          <div className="mt-8 pt-5 border-t border-[#BAD6EB]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#081F5C]">
                <KeyRound className="w-3.5 h-3.5 text-[#334EAC]" />
                <span>Uji Coba Masuk Cepat (Klik untuk Isi):</span>
              </div>
              <span className="text-[10px] text-[#334EAC] font-semibold bg-[#D0E3FF] px-2 py-0.5 rounded">
                Demo Siap Pakai
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              
              {/* Admin Chip */}
              <button
                type="button"
                onClick={() => quickFill('admin', 'admin123', 'admin')}
                className="text-left p-2 rounded-xl border border-[#334EAC]/30 bg-white hover:border-[#334EAC] hover:bg-[#D0E3FF]/30 transition-all text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-[#081F5C]">
                  <ShieldCheck className="w-3 h-3 text-[#334EAC]" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-[#081F5C]/75 font-mono mt-0.5">
                  admin / admin123
                </div>
              </button>

              {/* Tentor Chips */}
              {tentors.slice(0, 5).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => quickFill(t.username, t.password, 'tentor')}
                  className="text-left p-2 rounded-xl border border-[#BAD6EB] bg-white hover:border-[#334EAC] hover:bg-[#D0E3FF]/30 transition-all text-xs truncate"
                  title={`${t.name} (${t.username})`}
                >
                  <div className="flex items-center gap-1 font-bold text-[#081F5C] truncate">
                    <GraduationCap className="w-3 h-3 text-[#7096D1] shrink-0" />
                    <span className="truncate">{t.name.split(',')[0]}</span>
                  </div>
                  <div className="text-[10px] text-[#081F5C]/75 font-mono mt-0.5 truncate">
                    {t.username} / {t.password}
                  </div>
                </button>
              ))}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
