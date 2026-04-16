import React from 'react';
import { cn } from '../lib/utils';

const GlassCard = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] dark:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};


export default GlassCard;
