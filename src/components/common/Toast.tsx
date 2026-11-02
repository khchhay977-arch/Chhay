/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExchange } from '../../context/ExchangeContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useExchange();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const icon = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
        }[toast.type];

        const borderColor = {
          success: 'border-emerald-500/30 bg-emerald-950/80',
          warning: 'border-amber-500/30 bg-amber-950/80',
          error: 'border-rose-500/30 bg-rose-950/80',
          info: 'border-cyan-500/30 bg-slate-900/90',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border backdrop-blur-md shadow-xl transition-all duration-200 text-xs leading-relaxed text-slate-100 ${borderColor}`}
          >
            {icon}
            <span className="flex-1 font-medium">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
