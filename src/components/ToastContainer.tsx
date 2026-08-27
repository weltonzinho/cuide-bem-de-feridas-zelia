import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white border-slate-700';
        let Icon = Info;

        if (toast.type === 'success') {
          bg = 'bg-emerald-950 text-emerald-50 border-emerald-700/60 shadow-emerald-950/30';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bg = 'bg-red-950 text-red-50 border-red-700/60 shadow-red-950/30';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950 text-amber-50 border-amber-700/60 shadow-amber-950/30';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${bg}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
