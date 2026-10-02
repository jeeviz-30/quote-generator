import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-900 text-stone-100 dark:bg-amber-400 dark:text-stone-950 shadow-2xl border border-stone-800 dark:border-amber-300 text-xs font-semibold animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-stone-950" />
      <span>{message}</span>
    </div>
  );
}
