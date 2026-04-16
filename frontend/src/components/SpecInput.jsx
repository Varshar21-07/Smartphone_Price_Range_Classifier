import React from 'react';
import { cn } from '../lib/utils';

const SpecInput = ({ label, icon: Icon, unit, className, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <label className="flex items-center gap-2.5 text-sm font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
        {Icon && <Icon className="w-4 h-4 text-blue-500/60" />}
        {label}
      </label>
      <div className="relative group">
        <input
          className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500/40 dark:focus:border-blue-500/50 transition-all pr-16 text-lg font-medium"
          {...props}
        />
        {unit && (
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-white/5 shadow-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};



export default SpecInput;
