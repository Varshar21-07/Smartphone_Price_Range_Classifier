import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Battery, Camera, Layers, Cpu, ShieldCheck, Info, Wifi, Monitor, Scale, Clock, Phone } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SpecInput from '../components/SpecInput';
import { cn } from '../lib/utils';

// Helper component for Yes/No fields
const SpecSelect = ({ label, icon: Icon, className, value, onChange, name }) => {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <label className="flex items-center gap-2.5 text-sm font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
        {Icon && <Icon className="w-4 h-4 text-blue-500/60" />}
        {label}
      </label>
      <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500/40 dark:focus:border-blue-500/50 transition-all appearance-none text-lg font-medium cursor-pointer"
        >
          <option value="">Select...</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Predict = ({ onPredict, isLoading }) => {
  const [specs, setSpecs] = useState({
    battery_power: '',
    dual_sim: '',
    fc: '',
    four_g: '',
    int_memory: '',
    mobile_wt: '',
    pc: '',
    px_height: '',
    px_width: '',
    ram: '',
    sc_h: '',
    sc_w: '',
    talk_time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(specs);
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-5xl px-4">
      <GlassCard className="w-full flex flex-col items-center gap-8 py-10 px-8 md:px-12 rounded-[2.5rem] bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:shadow-2xl">
        <div className="flex items-center gap-5 w-full border-b border-slate-100 dark:border-white/10 pb-8">
          <div className="p-4 bg-blue-500/10 rounded-2xl">
             <Cpu className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Predict Price Range</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Enter all smartphone specifications to classify its market price range accurately.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <SpecInput label="RAM" icon={Smartphone} unit="MB" name="ram" placeholder="e.g. 2048" value={specs.ram} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SpecInput label="Battery" icon={Battery} unit="mAh" name="battery_power" placeholder="e.g. 5000" value={specs.battery_power} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SpecInput label="Internal Storage" icon={Layers} unit="GB" name="int_memory" placeholder="e.g. 128" value={specs.int_memory} onChange={handleChange} type="number" required />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <SpecInput label="Primary Camera" icon={Camera} unit="MP" name="pc" placeholder="e.g. 64" value={specs.pc} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SpecInput label="Front Camera" icon={Camera} unit="MP" name="fc" placeholder="e.g. 16" value={specs.fc} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <SpecInput label="Weight" icon={Scale} unit="g" name="mobile_wt" placeholder="e.g. 180" value={specs.mobile_wt} onChange={handleChange} type="number" required />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <SpecInput label="Resolution Height" icon={Monitor} unit="px" name="px_height" placeholder="e.g. 1920" value={specs.px_height} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <SpecInput label="Resolution Width" icon={Monitor} unit="px" name="px_width" placeholder="e.g. 1080" value={specs.px_width} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <SpecInput label="Screen Height" icon={Smartphone} unit="cm" name="sc_h" placeholder="e.g. 15" value={specs.sc_h} onChange={handleChange} type="number" required />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <SpecInput label="Screen Width" icon={Smartphone} unit="cm" name="sc_w" placeholder="e.g. 7" value={specs.sc_w} onChange={handleChange} type="number" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <SpecInput label="Talk Time" icon={Clock} unit="h" name="talk_time" placeholder="e.g. 20" value={specs.talk_time} onChange={handleChange} type="number" required />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-col gap-6">
               <SpecSelect label="Dual SIM" icon={Phone} name="dual_sim" value={specs.dual_sim} onChange={handleChange} required />
               <SpecSelect label="4G Support" icon={Wifi} name="four_g" value={specs.four_g} onChange={handleChange} required />
            </motion.div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col items-center">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white font-bold py-4.5 rounded-[1.25rem] transition-all duration-300 shadow-xl shadow-blue-500/20 dark:shadow-blue-500/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-lg"
            >
              {isLoading ? "Processing..." : "Predict Price Range"}
            </button>

            <div className="flex items-center justify-center gap-2 pt-4">
              <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black">
                Processed via secure local ANN model
              </span>
            </div>
          </div>
        </form>
      </GlassCard>

      <div className="flex gap-16 mt-8 mb-12">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">98% Accuracy</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">Test Validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
