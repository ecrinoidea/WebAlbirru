import React from 'react';
import { useBimbel } from '../../context/BimbelContext';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Calendar,
  FileCheck,
} from 'lucide-react';

export const HonorStatus: React.FC = () => {
  const { currentTentor, reports, honorSummaries, openPhotoModal } = useBimbel();

  // Find honor summary for this tentor
  const myHonor = honorSummaries.find((h) => h.tentorId === currentTentor.id) || {
    tentorId: currentTentor.id,
    tentorName: currentTentor.name,
    accountNumber: 'BCA 8720194821',
    bankName: 'Bank Central Asia',
    verifiedSessionsCount: 0,
    pendingSessionsCount: 0,
    ratePerSession: currentTentor.ratePerSession,
    totalReadyToTransfer: 0,
    transferStatus: 'Siap Ditransfer' as const,
    lastTransferDate: '15 Sep 2026',
  };

  // Find all reports by this tentor
  const myReports = reports.filter((r) => r.tentorId === currentTentor.id);
  const approvedReports = myReports.filter((r) => r.status === 'Disetujui');
  const pendingReports = myReports.filter((r) => r.status === 'Menunggu Verifikasi');
  const revisionReports = myReports.filter((r) => r.status === 'Perlu Revisi');

  return (
    <div className="space-y-6">
      
      {/* Honor Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Terkumpul */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Estimasi Honor Berjalan
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D0E3FF] text-[#334EAC] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#081F5C] tabular-nums mb-1">
            Rp {myHonor.totalReadyToTransfer.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-[#081F5C]/70">
            {myHonor.verifiedSessionsCount} Sesi Terverifikasi
          </div>
        </div>

        {/* Tarif Per Sesi */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Tarif Honor Mengajar
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D0E3FF] text-[#334EAC] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#081F5C] tabular-nums mb-1">
            Rp {myHonor.ratePerSession.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-[#081F5C]/70">
            Per Sesi (90 Menit Kelas)
          </div>
        </div>

        {/* Sesi Menunggu Verifikasi */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Antrean Verifikasi Admin
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800 tabular-nums mb-1">
            {pendingReports.length} Sesi
          </div>
          <div className="text-xs text-[#081F5C]/70">
            Estimasi Tambahan: Rp {(pendingReports.length * myHonor.ratePerSession).toLocaleString('id-ID')}
          </div>
        </div>

        {/* Status Pencairan */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Status Pencairan Bank
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-[#081F5C] mb-1">
            {myHonor.transferStatus}
          </div>
          <div className="text-[11px] text-[#081F5C]/70 font-medium">
            {myHonor.accountNumber}
          </div>
        </div>

      </div>

      {/* History of Submitted Teaching Reports */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#081F5C] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#334EAC]" />
              <span>Riwayat Pengajuan Laporan & Presensi Anda</span>
            </h4>
            <p className="text-xs text-[#081F5C]/70">
              Daftar sesi yang telah Anda laporkan ke sistem verifikasi Albirru Junior.
            </p>
          </div>

          <div className="text-xs font-bold text-[#334EAC]">
            Total {myReports.length} Laporan Diajukan
          </div>
        </div>

        {myReports.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#081F5C]/60 bg-[#F7F2EB] rounded-xl border border-dashed border-[#BAD6EB]">
            Belum ada laporan mengajar yang diajukan. Gunakan tab "Isi Laporan Sesi" untuk melaporkan kelas pertama Anda.
          </div>
        ) : (
          <div className="divide-y divide-[#BAD6EB]/60">
            {myReports.map((report) => {
              const hadirCount = report.attendance.filter((a) => a.status === 'Hadir').length;
              return (
                <div key={report.id} className="py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#081F5C]">{report.groupName}</span>
                      <span className="text-[#334EAC] font-semibold">· {report.subject}</span>
                      <span className="text-[10px] text-[#081F5C]/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {report.date}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#081F5C]/80 line-clamp-1">
                      {report.topicChapter}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-[#081F5C]/70">
                      <span>Presensi: <strong className="text-[#081F5C]">{hadirCount}/{report.attendance.length} Hadir</strong></span>
                      <span>Honor: <strong className="text-[#334EAC]">Rp {(report.sessionFee || 70000).toLocaleString('id-ID')}</strong></span>
                      {report.reviewedBy && (
                        <span>Ditinjau oleh: {report.reviewedBy}</span>
                      )}
                    </div>

                    {report.revisionNote && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] font-medium flex items-start gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>Catatan Revisi Admin: {report.revisionNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Status & Thumbnail */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={() =>
                        openPhotoModal(
                          report.classPhotoUrl,
                          report.photoCaption,
                          `Bukti Sesi - ${report.groupName}`
                        )
                      }
                      className="w-12 h-10 rounded-lg overflow-hidden border border-[#BAD6EB] relative group shadow-2xs hover:scale-105 transition-transform"
                      title="Lihat foto bukti"
                    >
                      <img
                        src={report.classPhotoUrl}
                        alt="Bukti"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>

                    <div>
                      {report.status === 'Disetujui' && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Disetujui
                        </span>
                      )}
                      {report.status === 'Menunggu Verifikasi' && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Menunggu Admin
                        </span>
                      )}
                      {report.status === 'Perlu Revisi' && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Perlu Revisi
                        </span>
                      )}
                    </div>
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
