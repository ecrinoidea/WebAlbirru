import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { TeachingReport, VerificationStatus } from '../../types';
import {
  FileCheck2,
  CheckCircle,
  AlertTriangle,
  Eye,
  Calendar,
  Users,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';

export const ReportVerification: React.FC = () => {
  const { reports, approveReport, requestReportRevision, openPhotoModal } = useBimbel();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>('all');
  const [revisionReportId, setRevisionReportId] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [selectedReportDetail, setSelectedReportDetail] = useState<TeachingReport | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.tentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.topicChapter.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenRevision = (report: TeachingReport) => {
    setRevisionReportId(report.id);
    setRevisionNote(report.revisionNote || 'Mohon lengkapi catatan evaluasi individual siswa.');
  };

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (revisionReportId && revisionNote.trim()) {
      requestReportRevision(revisionReportId, revisionNote.trim());
      setRevisionReportId(null);
      setRevisionNote('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="bg-[#FFF9F0] p-4 rounded-2xl border border-[#BAD6EB]/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7096D1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari laporan tentor, kelompok, materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] placeholder:text-[#081F5C]/50 focus:outline-none focus:ring-2 focus:ring-[#334EAC]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#F7F2EB] p-1.5 rounded-xl border border-[#BAD6EB] shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#334EAC] ml-1.5 mr-0.5" />
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:bg-[#BAD6EB]/30'
            }`}
          >
            Semua ({reports.length})
          </button>
          <button
            onClick={() => setStatusFilter('Menunggu Verifikasi')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'Menunggu Verifikasi'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:bg-[#BAD6EB]/30'
            }`}
          >
            Menunggu Verifikasi ({reports.filter((r) => r.status === 'Menunggu Verifikasi').length})
          </button>
          <button
            onClick={() => setStatusFilter('Disetujui')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'Disetujui'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:bg-[#BAD6EB]/30'
            }`}
          >
            Disetujui ({reports.filter((r) => r.status === 'Disetujui').length})
          </button>
        </div>

      </div>

      {/* Verification Table */}
      <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#081F5C] text-[#FFF9F0] text-xs font-bold border-b border-[#334EAC]">
                <th className="py-3.5 px-4 w-44">Waktu & Tentor</th>
                <th className="py-3.5 px-4 w-44">Kelompok & Mapel</th>
                <th className="py-3.5 px-4">Rangkuman Materi & Catatan</th>
                <th className="py-3.5 px-4 text-center w-28">Bukti Kelas</th>
                <th className="py-3.5 px-4 text-center w-36">Rekap Presensi</th>
                <th className="py-3.5 px-4 text-center w-36">Status</th>
                <th className="py-3.5 px-4 text-center w-48">Aksi Verifikasi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#BAD6EB]/50 text-xs">
              {filteredReports.map((report) => {
                const totalStudents = report.attendance.length;
                const hadirCount = report.attendance.filter((a) => a.status === 'Hadir').length;
                const izinCount = report.attendance.filter((a) => a.status === 'Izin').length;
                const sakitCount = report.attendance.filter((a) => a.status === 'Sakit').length;
                const alpaCount = report.attendance.filter((a) => a.status === 'Alpa').length;

                return (
                  <tr key={report.id} className="hover:bg-[#F7F2EB]/50 transition-colors">
                    
                    {/* Date & Tentor */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-[#081F5C]">
                        {report.tentorName}
                      </div>
                      <div className="text-[11px] text-[#081F5C]/70 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#334EAC]" />
                        <span>{report.date}</span>
                      </div>
                      <div className="text-[10px] text-[#7096D1] mt-0.5">
                        {report.submittedAt}
                      </div>
                    </td>

                    {/* Group & Subject */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-[#334EAC]">
                        {report.groupName}
                      </div>
                      <div className="text-[11px] font-medium text-[#081F5C]/80 mt-0.5">
                        {report.subject}
                      </div>
                      <div className="text-[10px] text-[#081F5C]/60 mt-0.5">
                        Honor: Rp {(report.sessionFee || 70000).toLocaleString('id-ID')}
                      </div>
                    </td>

                    {/* Topic & Notes */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-[#081F5C] mb-1">
                        {report.topicChapter}
                      </div>
                      <p className="text-[11px] text-[#081F5C]/75 line-clamp-2 italic">
                        "{report.generalNotes}"
                      </p>
                      {report.revisionNote && (
                        <div className="mt-1.5 p-1.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 font-medium">
                          ⚠️ Catatan Revisi Admin: {report.revisionNote}
                        </div>
                      )}
                    </td>

                    {/* Class Photo Thumbnail */}
                    <td className="py-4 px-4 align-top text-center">
                      <button
                        onClick={() =>
                          openPhotoModal(
                            report.classPhotoUrl,
                            report.photoCaption,
                            `Bukti Kelas - ${report.groupName} (${report.date})`
                          )
                        }
                        className="group relative inline-block rounded-xl overflow-hidden border border-[#BAD6EB] shadow-2xs hover:scale-105 transition-transform"
                      >
                        <img
                          src={report.classPhotoUrl}
                          alt="Bukti Sesi Belajar"
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover"
                        />
                        <div className="absolute inset-0 bg-[#081F5C]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>
                      <div className="text-[10px] text-[#081F5C]/60 mt-0.5">
                        Klik Zoom
                      </div>
                    </td>

                    {/* Attendance Summary */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="inline-block bg-[#F7F2EB] px-2 py-1 rounded-lg border border-[#BAD6EB]/60">
                        <div className="font-bold text-[#081F5C] tabular-nums">
                          {hadirCount} / {totalStudents} Hadir
                        </div>
                        <div className="text-[10px] text-[#081F5C]/70">
                          {izinCount > 0 && `${izinCount} Izin `}
                          {sakitCount > 0 && `${sakitCount} Sakit `}
                          {alpaCount > 0 && `${alpaCount} Alpa`}
                          {izinCount === 0 && sakitCount === 0 && alpaCount === 0 && 'Nihil Absen'}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedReportDetail(report)}
                        className="block mx-auto text-[10px] font-semibold text-[#334EAC] hover:underline mt-1"
                      >
                        Lihat Rincian
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 align-top text-center">
                      {report.status === 'Disetujui' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Disetujui
                        </span>
                      )}
                      {report.status === 'Menunggu Verifikasi' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Menunggu
                        </span>
                      )}
                      {report.status === 'Perlu Revisi' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                          Perlu Revisi
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                        {report.status !== 'Disetujui' ? (
                          <>
                            <button
                              onClick={() => approveReport(report.id)}
                              className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] shadow-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" /> Setujui
                            </button>
                            <button
                              onClick={() => handleOpenRevision(report)}
                              className="w-full sm:w-auto px-2.5 py-1.5 bg-[#F7F2EB] hover:bg-amber-100 text-[#081F5C] border border-[#BAD6EB] rounded-lg font-semibold text-[11px] transition-colors"
                            >
                              Revisi
                            </button>
                          </>
                        ) : (
                          <div className="text-[11px] text-[#081F5C]/60 italic">
                            Oleh: {report.reviewedBy || 'Admin'}
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revision Modal */}
      {revisionReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] w-full max-w-md rounded-2xl border border-[#7096D1] shadow-2xl p-5">
            <h3 className="text-sm font-bold text-[#081F5C] flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              Minta Revisi Laporan Mengajar
            </h3>
            <p className="text-xs text-[#081F5C]/70 mb-3">
              Kirimkan instruksi perbaikan kepada tentor pengampu:
            </p>
            <form onSubmit={handleSendRevision} className="space-y-3">
              <textarea
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Tuliskan alasan revisi..."
                rows={4}
                className="w-full text-xs p-3 bg-white border border-[#BAD6EB] rounded-xl text-[#081F5C] focus:ring-2 focus:ring-[#334EAC] focus:outline-none"
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevisionReportId(null)}
                  className="px-3.5 py-1.5 text-xs text-[#081F5C] hover:bg-[#F7F2EB] rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-amber-700 hover:bg-amber-800 rounded-lg font-semibold shadow-xs"
                >
                  Kirim Catatan Revisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drill-down Modal for Attendance */}
      {selectedReportDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] w-full max-w-lg rounded-2xl border border-[#7096D1] shadow-2xl overflow-hidden">
            <div className="bg-[#081F5C] px-5 py-3.5 text-[#FFF9F0] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold">Rincian Evaluasi & Presensi Siswa</h4>
                <p className="text-[11px] text-[#BAD6EB]">{selectedReportDetail.groupName} · {selectedReportDetail.subject}</p>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="text-[#BAD6EB] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
              <div className="text-xs font-bold text-[#081F5C]">
                Materi: <span className="font-normal">{selectedReportDetail.topicChapter}</span>
              </div>
              <div className="divide-y divide-[#BAD6EB]/40">
                {selectedReportDetail.attendance.map((att, idx) => (
                  <div key={idx} className="py-2.5 flex items-start justify-between text-xs gap-3">
                    <div>
                      <div className="font-bold text-[#081F5C]">{att.studentName}</div>
                      <div className="text-[11px] text-[#081F5C]/70 italic mt-0.5">
                        {att.note || 'Tidak ada catatan khusus.'}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        att.status === 'Hadir'
                          ? 'bg-emerald-100 text-emerald-800'
                          : att.status === 'Izin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F7F2EB] px-5 py-3 border-t border-[#BAD6EB] flex justify-end">
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#334EAC] text-white rounded-xl shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
