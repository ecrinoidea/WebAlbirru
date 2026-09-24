import React from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { X, Image as ImageIcon } from 'lucide-react';

export const PhotoPreviewModal: React.FC = () => {
  const { photoModal, closePhotoModal } = useBimbel();

  if (!photoModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081F5C]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF9F0] w-full max-w-2xl rounded-2xl border border-[#7096D1] shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#081F5C] px-5 py-3.5 flex items-center justify-between text-[#FFF9F0]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#BAD6EB]" />
            <h3 className="text-sm font-bold truncate">
              {photoModal.title || 'Dokumentasi Bukti Kelas Sesi Belajar'}
            </h3>
          </div>
          <button
            onClick={closePhotoModal}
            className="text-[#BAD6EB] hover:text-[#FFF9F0] p-1 rounded-lg hover:bg-[#334EAC]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Photo Viewport */}
        <div className="p-4 bg-black/5 flex items-center justify-center">
          <img
            src={photoModal.url}
            alt="Dokumentasi Kelas"
            referrerPolicy="no-referrer"
            className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-md"
          />
        </div>

        {/* Caption & Footer */}
        <div className="p-4 bg-[#FFF9F0] border-t border-[#BAD6EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <p className="text-[#081F5C]/80 italic">
            "{photoModal.caption || 'Foto dokumentasi kelas resmi Bimbel Albirru Junior'}"
          </p>
          <button
            onClick={closePhotoModal}
            className="px-4 py-1.5 bg-[#334EAC] hover:bg-[#081F5C] text-white rounded-xl font-semibold shadow-xs shrink-0 self-end sm:self-auto"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
