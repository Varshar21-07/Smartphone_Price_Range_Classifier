import React from 'react';
import { Smartphone, Battery, Camera, Layers, RefreshCcw, Home as HomeIcon } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Result = ({ specs, result, onTryAgain, onGoHome }) => {
  if (!specs || !result) return null;

  const { price_range, confidence } = result;
  
  const ranges = {
    0: { label: '₹8,000 - ₹12,000', desc: 'Entry-level budget segment', color: 'text-slate-600 dark:text-slate-400' },
    1: { label: '₹12,000 - ₹15,000', desc: 'Mid-range segment', color: 'text-slate-700 dark:text-slate-300' },
    2: { label: '₹15,000 - ₹20,000', desc: 'Premium segment', color: 'text-blue-600 dark:text-blue-400' },
    3: { label: '₹20,000 - ₹25,000', desc: 'Ultra-premium flagship segment', color: 'text-blue-800 dark:text-blue-300' }
  };

  const currentRange = ranges[price_range] || ranges[0];

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 w-full max-w-4xl px-4">
      <GlassCard className="w-full max-w-2xl text-center py-12 px-10 relative overflow-hidden bg-white/90 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

        <div className="space-y-3 mb-10">
          <span className="text-xs font-black tracking-[0.2em] text-blue-500 uppercase">Analysis Complete</span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Predicted Segment</h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 mb-10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
            {(parseFloat(confidence) * 100).toFixed(1)}% Confidence
          </div>
          <h3 className={`text-4xl font-black font-outfit mb-2 ${currentRange.color}`}>
            {currentRange.label}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {currentRange.desc}
          </p>
        </div>

        <div className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden mb-10 shadow-sm dark:shadow-none">
          <div className="grid grid-cols-2 text-left bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-white/10 border-solid">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Specification</span>
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Value</span>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            <div className="grid grid-cols-2 text-left px-6 py-4 items-center group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Smartphone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> RAM
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-white">{specs.ram} MB</span>
            </div>
            <div className="grid grid-cols-2 text-left px-6 py-4 items-center group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Battery className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Battery
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-white">{specs.battery_power} mAh</span>
            </div>
            <div className="grid grid-cols-2 text-left px-6 py-4 items-center group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex items-center gap-3 text-sm font-bold text-blue-700 dark:text-blue-300">
                <Camera className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Camera
              </div>
              <span className="text-base font-black text-blue-700 dark:text-blue-300">{specs.pc} MP</span>
            </div>
            <div className="grid grid-cols-2 text-left px-6 py-4 items-center group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Storage
              </div>
              <span className="text-base font-medium text-slate-900 dark:text-white">{specs.int_memory} GB</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <button 
            onClick={onGoHome}
            className="w-full sm:w-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all duration-300 flex justify-center items-center gap-2"
          >
            <HomeIcon className="w-4 h-4" /> Home
          </button>
          <button 
            onClick={onTryAgain}
            className="w-full sm:w-1/2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-blue-600/20 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Predict Another
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Result;
