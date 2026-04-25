import React from 'react';
import { BarChart3, Layers, Info, ChevronLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Admin = ({ metrics, onGoHome }) => {
  if (!metrics) {
    return (
      <div className="w-full max-w-4xl px-4 flex justify-center animate-in fade-in">
        <GlassCard className="p-8 text-center text-slate-500 dark:text-slate-400">
          Loading metrics... Ensure backend is running.
        </GlassCard>
      </div>
    );
  }

  const { total_predictions, distribution, accuracy } = metrics;
  
  const calculatePercentage = (count) => {
    if (total_predictions === 0) return 0;
    return Math.round((count / total_predictions) * 100);
  };

  const getLabel = (range) => {
    const labels = ["Budget", "Low-Mid", "Mid-High", "Premium"];
    return labels[range] || `Class ${range}`;
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500 w-full max-w-3xl px-4">
      <div className="w-full flex items-center gap-3 mb-8 ml-2 relative">
        <button 
          onClick={onGoHome}
          className="absolute -top-4 -left-10 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-blue-500 transition-colors shadow-sm active:scale-95"
          title="Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <BarChart3 className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">System Metrics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Model performance and segment distribution analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
        <div className="grid grid-cols-1 gap-6">
            <GlassCard className="!p-8 bg-white/50 dark:bg-slate-900/50">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-500">Model Accuracy</span>
                <span className="text-5xl font-black text-slate-900 dark:text-white font-outfit">
                    {(accuracy * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Training Validation</span>
              </div>
            </GlassCard>
            <GlassCard className="!p-8 bg-white/50 dark:bg-slate-900/50">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-500">Live Samples</span>
                <span className="text-5xl font-black text-slate-900 dark:text-white font-outfit">{total_predictions}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Processed</span>
              </div>
            </GlassCard>
        </div>
        
        <GlassCard className="flex flex-col !p-8 bg-white/50 dark:bg-slate-900/50 justify-center">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Segment Distribution
            </h3>
            
            <div className="space-y-4 w-full">
              {[0, 1, 2, 3].map((range) => {
                const count = distribution[range] || 0;
                const percentage = calculatePercentage(count);
                
                return (
                  <div key={range} className="space-y-1.5 w-full">
                    <div className="flex justify-between text-xs font-bold w-full">
                      <span className="text-slate-600 dark:text-slate-300">{getLabel(range)}</span>
                      <span className="text-slate-400 dark:text-slate-500">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
        </GlassCard>
      </div>

      <div className="mt-4 flex items-center gap-3 p-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 dark:text-slate-400 text-xs max-w-md shadow-sm">
        <Info className="w-5 h-5 flex-shrink-0 text-blue-500/50" />
        <p className="leading-relaxed">Data is retrieved from the PostgreSQL database records. Metrics update in real-time as new predictions are processed.</p>
      </div>
    </div>
  );
};


export default Admin;
