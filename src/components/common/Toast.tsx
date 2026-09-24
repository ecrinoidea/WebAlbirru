import React, { useEffect } from 'react';
import { useBimbel } from '../../context/BimbelContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useBimbel();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dismissToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
          isSuccess
            ? 'bg-[#081F5C] text-[#FFF9F0] border-[#7096D1]'
            : isWarning
            ? 'bg-amber-900 text-amber-50 border-amber-500'
            : 'bg-[#334EAC] text-[#FFF9F0] border-[#BAD6EB]'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {isWarning && <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />}
        {!isSuccess && !isWarning && <Info className="w-4 h-4 text-[#BAD6EB] shrink-0" />}

        <span className="max-w-xs">{toast.message}</span>

        <button
          onClick={dismissToast}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
