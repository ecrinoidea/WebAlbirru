import React, { useState } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { SppInvoice, TentorHonorSummary } from '../../types';
import {
  Wallet,
  CheckCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  Building,
  Send,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const FinancialSummary: React.FC = () => {
  const { invoices, honorSummaries, verifyInvoicePayment, processHonorTransfer } = useBimbel();

  const [activeFinanceTab, setActiveFinanceTab] = useState<'spp' | 'honor'>('spp');
  const [sppFilter, setSppFilter] = useState<'all' | 'unpaid' | 'verified'>('all');
  const [selectedTransferReceipt, setSelectedTransferReceipt] = useState<TentorHonorSummary | null>(null);

  // Financial aggregates
  const totalSppBilled = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalSppCollected = invoices
    .filter((i) => i.status === 'Lunas' || i.status === 'QRIS Terbayar')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalHonorReady = honorSummaries
    .filter((h) => h.transferStatus === 'Siap Ditransfer')
    .reduce((acc, h) => acc + h.totalReadyToTransfer, 0);

  const totalHonorPaid = honorSummaries
    .filter((h) => h.transferStatus === 'Sudah Ditransfer')
    .reduce((acc, h) => acc + h.totalReadyToTransfer, 0);

  const netMargin = totalSppCollected - (totalHonorReady + totalHonorPaid);

  const filteredInvoices = invoices.filter((inv) => {
    if (sppFilter === 'unpaid') return inv.status === 'Belum Bayar' || inv.status === 'Menunggu Verifikasi';
    if (sppFilter === 'verified') return inv.status === 'Lunas' || inv.status === 'QRIS Terbayar';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total SPP */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Penerimaan SPP Siswa (September)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D0E3FF] text-[#334EAC] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#081F5C] tabular-nums mb-1">
            Rp {totalSppCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-[#081F5C]/70 flex items-center justify-between">
            <span>Total Tagihan: Rp {totalSppBilled.toLocaleString('id-ID')}</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {Math.round((totalSppCollected / totalSppBilled) * 100)}%
            </span>
          </div>
        </div>

        {/* Total Honor Tentor */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Honor Tentor Siap Ditransfer
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D0E3FF] text-[#334EAC] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#081F5C] tabular-nums mb-1">
            Rp {totalHonorReady.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-[#081F5C]/70 flex items-center justify-between">
            <span>Sudah Ditransfer: Rp {totalHonorPaid.toLocaleString('id-ID')}</span>
            <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              {honorSummaries.filter((h) => h.transferStatus === 'Siap Ditransfer').length} Tentor Antre
            </span>
          </div>
        </div>

        {/* Net Margin */}
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#334EAC]">
              Surplus Kas Operasional Bimbel
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums mb-1">
            Rp {netMargin.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-[#081F5C]/70">
            Arus kas bersih setelah provisi honor seluruh sesi mengajar
          </div>
        </div>

      </div>

      {/* Segmented Finance Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 bg-[#F7F2EB] p-1.5 rounded-xl border border-[#BAD6EB]">
          <button
            onClick={() => setActiveFinanceTab('spp')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFinanceTab === 'spp'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:bg-[#BAD6EB]/30'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Status Pembayaran SPP Siswa</span>
          </button>

          <button
            onClick={() => setActiveFinanceTab('honor')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFinanceTab === 'honor'
                ? 'bg-[#334EAC] text-white shadow-xs'
                : 'text-[#081F5C] hover:bg-[#BAD6EB]/30'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Rekapitulasi Honor Per Sesi Tentor</span>
          </button>
        </div>

        {activeFinanceTab === 'spp' && (
          <div className="flex items-center gap-1.5 bg-[#FFF9F0] p-1 rounded-xl border border-[#BAD6EB]">
            <button
              onClick={() => setSppFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                sppFilter === 'all' ? 'bg-[#081F5C] text-white' : 'text-[#081F5C]'
              }`}
            >
              Semua ({invoices.length})
            </button>
            <button
              onClick={() => setSppFilter('unpaid')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                sppFilter === 'unpaid' ? 'bg-[#081F5C] text-white' : 'text-[#081F5C]'
              }`}
            >
              Perlu Verifikasi / Belum Bayar
            </button>
            <button
              onClick={() => setSppFilter('verified')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                sppFilter === 'verified' ? 'bg-[#081F5C] text-white' : 'text-[#081F5C]'
              }`}
            >
              Lunas ({invoices.filter((i) => i.status === 'Lunas' || i.status === 'QRIS Terbayar').length})
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: SPP Invoices Table */}
      {activeFinanceTab === 'spp' && (
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#081F5C] text-[#FFF9F0] text-xs font-bold border-b border-[#334EAC]">
                  <th className="py-3 px-4">No. Invoice & Siswa</th>
                  <th className="py-3 px-4">Kelompok Belajar</th>
                  <th className="py-3 px-4">Bulan Tagihan</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Metode & Waktu</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD6EB]/50 text-xs">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F7F2EB]/50 transition-colors">
                    
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#081F5C]">{inv.studentName}</div>
                      <div className="text-[10px] text-[#7096D1] font-mono">{inv.invoiceNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#334EAC]">{inv.groupName}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#081F5C]/80">
                      {inv.month}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-[#081F5C] tabular-nums">
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="font-semibold text-[#081F5C]">
                        {inv.paymentMethod || '-'}
                      </div>
                      <div className="text-[10px] text-[#081F5C]/60">
                        {inv.paidAt || 'Menunggu Pembayaran'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {inv.status === 'Lunas' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Lunas
                        </span>
                      )}
                      {inv.status === 'QRIS Terbayar' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-[#D0E3FF] px-2 py-0.5 rounded-full">
                          QRIS Sukses
                        </span>
                      )}
                      {inv.status === 'Menunggu Verifikasi' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Verifikasi Transfer
                        </span>
                      )}
                      {inv.status === 'Belum Bayar' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Belum Bayar
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {inv.status === 'Menunggu Verifikasi' ? (
                        <button
                          onClick={() => verifyInvoicePayment(inv.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Verifikasi Lunas
                        </button>
                      ) : inv.status === 'Belum Bayar' ? (
                        <a
                          href={`https://wa.me/?text=Halo%20Bunda%2F莊yah%20dari%20${encodeURIComponent(inv.studentName)},%20mengingatkan%20tagihan%20SPP%20Bimbel%20Albirru%20Junior%20bulan%20${encodeURIComponent(inv.month)}%20sebesar%20Rp%20350.000.%20Terima%20kasih.`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7F2EB] hover:bg-[#BAD6EB]/30 text-[#081F5C] border border-[#BAD6EB] rounded-lg text-[11px] font-semibold"
                        >
                          <Send className="w-3 h-3 text-[#334EAC]" /> Ingatkan WA
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#081F5C]/60 italic font-medium">Tuntas</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Tentor Honor Summaries Table */}
      {activeFinanceTab === 'honor' && (
        <div className="bg-[#FFF9F0] border border-[#BAD6EB] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#081F5C] text-[#FFF9F0] text-xs font-bold border-b border-[#334EAC]">
                  <th className="py-3.5 px-4">Nama Tentor & Rekening</th>
                  <th className="py-3.5 px-4 text-center">Sesi Terverifikasi</th>
                  <th className="py-3.5 px-4 text-center">Sesi Antrean</th>
                  <th className="py-3.5 px-4 text-right">Tarif / Sesi</th>
                  <th className="py-3.5 px-4 text-right">Total Siap Transfer</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi Transfer</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#BAD6EB]/50 text-xs">
                {honorSummaries.map((honor) => (
                  <tr key={honor.tentorId} className="hover:bg-[#F7F2EB]/50 transition-colors">
                    
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#081F5C]">{honor.tentorName}</div>
                      <div className="text-[11px] text-[#334EAC] font-medium flex items-center gap-1 mt-0.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{honor.accountNumber} ({honor.bankName})</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-[#081F5C] tabular-nums">
                      {honor.verifiedSessionsCount} Sesi
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full font-bold tabular-nums">
                        {honor.pendingSessionsCount} Sesi
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-semibold text-[#081F5C] tabular-nums">
                      Rp {honor.ratePerSession.toLocaleString('id-ID')}
                    </td>

                    <td className="py-4 px-4 text-right font-extrabold text-[#334EAC] tabular-nums text-sm">
                      Rp {honor.totalReadyToTransfer.toLocaleString('id-ID')}
                    </td>

                    <td className="py-4 px-4 text-center">
                      {honor.transferStatus === 'Siap Ditransfer' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                          Siap Ditransfer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                          <CheckCircle className="w-3 h-3" /> Sudah Ditransfer
                        </span>
                      )}
                      {honor.lastTransferDate && (
                        <div className="text-[10px] text-[#081F5C]/60 mt-0.5">
                          Tgl: {honor.lastTransferDate}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      {honor.transferStatus === 'Siap Ditransfer' ? (
                        <button
                          onClick={() => processHonorTransfer(honor.tentorId)}
                          className="px-3 py-1.5 bg-[#334EAC] hover:bg-[#081F5C] text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
                        >
                          Transfer Honor
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedTransferReceipt(honor)}
                          className="px-2.5 py-1 bg-[#F7F2EB] hover:bg-[#BAD6EB]/30 text-[#081F5C] border border-[#BAD6EB] rounded-lg text-[11px] font-semibold flex items-center gap-1 mx-auto"
                        >
                          <FileSpreadsheet className="w-3 h-3 text-[#334EAC]" /> Bukti
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer Receipt Modal */}
      {selectedTransferReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] w-full max-w-md rounded-2xl border border-[#7096D1] shadow-2xl p-6">
            <div className="text-center pb-4 border-b border-[#BAD6EB]">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#081F5C]">
                Bukti Realisasi Transfer Honorarium
              </h4>
              <p className="text-xs text-[#081F5C]/70">
                Bimbel Albirru Junior · Periode September 2026
              </p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#081F5C]/70">Penerima:</span>
                <span className="font-bold text-[#081F5C]">{selectedTransferReceipt.tentorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#081F5C]/70">Rekening Tujuan:</span>
                <span className="font-semibold text-[#081F5C]">{selectedTransferReceipt.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#081F5C]/70">Sesi Terverifikasi:</span>
                <span className="font-bold text-[#081F5C]">{selectedTransferReceipt.verifiedSessionsCount} Sesi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#081F5C]/70">Tarif Per Sesi:</span>
                <span>Rp {selectedTransferReceipt.ratePerSession.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-[#BAD6EB] flex justify-between text-sm font-extrabold text-[#334EAC]">
                <span>Total Ditransfer:</span>
                <span>Rp {selectedTransferReceipt.totalReadyToTransfer.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTransferReceipt(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#081F5C] text-white rounded-xl shadow-xs"
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
