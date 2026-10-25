import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Gift, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isReward = toast.type === 'reward';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              isReward
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950'
                : isSuccess
                ? 'bg-white border-emerald-200 text-neutral-900'
                : isWarning
                ? 'bg-white border-amber-300 text-neutral-900'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isReward ? (
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Gift className="w-4 h-4" />
                </div>
              ) : isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : isWarning ? (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              ) : (
                <Info className="w-5 h-5 text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
