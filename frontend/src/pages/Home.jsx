import React, { useState, useEffect } from 'react';
import { Smartphone, ArrowRight, Cpu, Target, Layers, Info } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { getModelInfo } from '../services/api';

const Home = ({ onStart, onBatch }) => {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const info = await getModelInfo();
      if (info) setModelInfo(info);
    };
    fetchInfo();
  }, []);

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-4xl px-4">
      <GlassCard className="w-full max-w-2xl text-center flex flex-col items-center gap-10 py-16 px-12 relative overflow-hidden bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 blur-[80px] -z-10" />
        
        <div className="p-5 bg-blue-500/10 rounded-[2.5rem]">
          <Smartphone className="w-16 h-16 text-blue-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[1.1] font-outfit">
            Smartphone Price <br /> Range Classifier
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Predict smartphone price segments using advanced AI models based on technical specifications and hardware features.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <button 
            onClick={onStart}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] group active:scale-[0.98]"
          >
            <span className="text-lg">Predict</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
          </button>
          
          <button 
            onClick={onBatch}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-sm group active:scale-[0.98]"
          >
            <Layers className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="text-lg">Batch</span>
          </button>

          <button 
            onClick={() => onMetrics && onMetrics()}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-sm group active:scale-[0.98]"
          >
            <Target className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <span className="text-lg">Metrics</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
          <Info className="w-4 h-4" /> 
          Click to enter smartphone details
        </div>

        <div className="grid grid-cols-3 gap-6 w-full pt-8">
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <Cpu className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black">Model</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">{modelInfo?.name ? 'ANN' : 'Loading...'}</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <Target className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black">Accuracy</span>
              <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
                {modelInfo ? `${(modelInfo.accuracy * 100).toFixed(0)}%` : '~92%'}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <Layers className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black">Classes</span>
              <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight">{modelInfo?.classes?.length || 4} Ranges</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Home;
