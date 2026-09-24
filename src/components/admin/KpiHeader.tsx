import React from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { Users, UserCheck, FileCheck2, Wallet, ArrowUpRight } from 'lucide-react';

export const KpiHeader: React.FC = () => {
  const { groups, availabilities, reports, invoices, selectedDay } = useBimbel();

  // 1. Total kelompok belajar aktif
  const totalActiveGroups = groups.length;
  const totalStudents = groups.reduce((acc, g) => acc + g.students.length, 0);
  const totalCapacity = groups.reduce((acc, g) => acc + g.maxCapacity, 0);

  // 2. Tentor siap mengajar hari ini
  const readyOrTeachingTentors = new Set(
    availabilities
      .filter((a) => a.day === selectedDay && (a.status === 'ready' || a.status === 'teaching'))
      .map((a) => a.tentorId)
  ).size;

  // 3. Persentase kelengkapan laporan
  const totalReportsCount = reports.length;
  const approvedReportsCount = reports.filter((r) => r.status === 'Disetujui').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'Menunggu Verifikasi').length;
  const reportCompletionRate = totalReportsCount > 0 ? Math.round((approvedReportsCount / totalReportsCount) * 100) : 0;

  // 4. Realisasi pembayaran SPP
  const totalSppBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalSppRealized = invoices
    .filter((inv) => inv.status === 'Lunas' || inv.status === 'QRIS Terbayar')
    .reduce((acc, inv) => acc + inv.amount, 0);
  const sppRealizationRate = totalSppBilled > 0 ? Math.round((totalSppRealized / totalSppBilled) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* KPI 1: Kelompok Belajar Aktif */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB]/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-[#7096D1] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#334EAC] tracking-wide">
            Kelompok Belajar Aktif
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#D0E3FF]/60 flex items-center justify-center text-[#334EAC]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-[#081F5C] tabular-nums">
            {totalActiveGroups}
          </span>
          <span className="text-xs text-[#081F5C]/70 font-medium">
            Kelompok Aktif
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#081F5C]/75 pt-2 border-t border-[#BAD6EB]/40">
          <span>Kapasitas Terisi:</span>
          <span className="font-semibold text-[#081F5C] tabular-nums">
            {totalStudents} / {totalCapacity} Siswa ({Math.round((totalStudents / totalCapacity) * 100)}%)
          </span>
        </div>
      </div>

      {/* KPI 2: Tentor Siap Mengajar Hari Ini */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB]/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-[#7096D1] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#334EAC] tracking-wide">
            Tentor Siap ({selectedDay})
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#D0E3FF]/60 flex items-center justify-center text-[#334EAC]">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-[#081F5C] tabular-nums">
            {readyOrTeachingTentors}
          </span>
          <span className="text-xs text-[#081F5C]/70 font-medium">
            Tentor Terjadwal
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#081F5C]/75 pt-2 border-t border-[#BAD6EB]/40">
          <span>Sesi Les Aktif Hari Ini:</span>
          <span className="font-semibold text-[#081F5C] tabular-nums">
            3 Sesi Jam Belajar
          </span>
        </div>
      </div>

      {/* KPI 3: Kelengkapan Laporan Mengajar */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB]/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-[#7096D1] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#334EAC] tracking-wide">
            Kelengkapan Laporan Sesi
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#D0E3FF]/60 flex items-center justify-center text-[#334EAC]">
            <FileCheck2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-[#081F5C] tabular-nums">
            {reportCompletionRate}%
          </span>
          <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            {pendingReportsCount} Antrean
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#081F5C]/75 pt-2 border-t border-[#BAD6EB]/40">
          <span>Status Laporan:</span>
          <span className="font-semibold text-[#081F5C] tabular-nums">
            {approvedReportsCount} Disetujui / {totalReportsCount} Terkirim
          </span>
        </div>
      </div>

      {/* KPI 4: Ringkasan Realisasi SPP */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB]/80 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-[#7096D1] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#334EAC] tracking-wide">
            Realisasi SPP September
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#D0E3FF]/60 flex items-center justify-center text-[#334EAC]">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-extrabold text-[#081F5C] tabular-nums">
            Rp {(totalSppRealized / 1000).toLocaleString('id-ID')}k
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            {sppRealizationRate}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-[#081F5C]/75 pt-2 border-t border-[#BAD6EB]/40">
          <span>Target Billed:</span>
          <span className="font-semibold text-[#081F5C] tabular-nums">
            Rp {(totalSppBilled / 1000).toLocaleString('id-ID')}k
          </span>
        </div>
      </div>

    </div>
  );
};
