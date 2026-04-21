import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, CheckCircle, AlertCircle, RefreshCcw, Home as HomeIcon, Download, ListChecks } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { predictBatch } from '../services/api';

const BatchPredict = ({ onGoHome }) => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const requiredColumns = [
    'battery_power', 'dual_sim', 'fc', 'four_g', 'int_memory', 
    'mobile_wt', 'pc', 'px_height', 'px_width', 'ram', 
    'sc_h', 'sc_w', 'talk_time'
  ];

  const downloadSample = () => {
    const headers = requiredColumns.join(',');
    const row = '842,0,1,0,7,188,2,20,756,2549,9,7,19';
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smartphone_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ranges = {
    0: { label: '₹8,000 - ₹12,000', color: 'text-slate-600 dark:text-slate-400' },
    1: { label: '₹12,000 - ₹15,000', color: 'text-slate-700 dark:text-slate-300' },
    2: { label: '₹15,000 - ₹20,000', color: 'text-blue-600 dark:text-blue-400' },
    3: { label: '₹20,000 - ₹25,000', color: 'text-blue-800 dark:text-blue-300' }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await predictBatch(file);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process batch CSV.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResults(null);
    setError(null);
  };

  if (results) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center w-full max-w-4xl px-4"
      >
        <GlassCard className="w-full text-center py-12 px-6 sm:px-10 relative overflow-hidden bg-white/90 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
          <div className="space-y-3 mb-10">
             <span className="text-xs font-black tracking-[0.2em] text-blue-500 uppercase">Batch Processing Complete</span>
             <h2 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">
               Processed {results.total_processed} items
             </h2>
          </div>

          <div className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden mb-10 shadow-sm max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse cursor-default">
              <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Row #</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Predicted Range</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/10">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {results.predictions.map((res, idx) => (
                  <motion.tr 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                      Sample {idx + 1}
                    </td>
                    <td className={`px-6 py-4 text-sm font-black ${ranges[res.price_range]?.color}`}>
                      {ranges[res.price_range]?.label || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {(res.confidence * 100).toFixed(1)}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm mx-auto">
            <button 
              onClick={onGoHome}
              className="w-full sm:w-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={reset}
              className="w-full sm:w-1/2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-4xl px-4"
    >
      <GlassCard className="w-full flex flex-col items-center gap-8 py-12 px-8 rounded-[2rem] bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10 shadow-xl">
        <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tight mb-2">Upload CSV Batch</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Upload a dataset of smartphone specifications to predict their price ranges simultaneously.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
          <div className="flex flex-col gap-4">
            <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl p-6 border border-blue-500/10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-500" /> Required Columns
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredColumns.map(col => (
                  <span key={col} className="text-[10px] px-2 py-1 bg-white/50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-md font-mono text-slate-600 dark:text-slate-400">
                    {col}
                  </span>
                ))}
              </div>
            </div>
            
            <button 
              onClick={downloadSample}
              className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm group"
            >
              <Download className="w-4 h-4 text-blue-500 transition-transform group-hover:translate-y-0.5" />
              Download Sample CSV
            </button>
          </div>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-center ${isDragOver ? 'border-blue-500 bg-blue-500/5' : 'border-slate-300 dark:border-slate-700 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
              <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" accept=".csv" />
              <AnimatePresence mode='wait'>
                {file ? (
                    <motion.div 
                      key="file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center gap-2"
                    >
                        <div className="p-4 bg-green-500/10 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white font-bold">{file.name}</p>
                            <p className="text-slate-500 text-[10px]">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                        <div className="p-4 bg-blue-500/10 rounded-full">
                            <UploadCloud className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white font-bold">Select CSV file</p>
                            <p className="text-slate-500 text-xs mt-1">or drag & drop here</p>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl text-sm w-full font-medium border border-red-500/20"
            >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
            </motion.div>
        )}

        <div className="flex gap-4 w-full max-w-sm mt-4">
            <button 
                onClick={onGoHome}
                disabled={loading}
                className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold py-4 rounded-xl transition-all text-sm"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                disabled={loading || !file}
                className="w-2/3 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
                {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <File className="w-5 h-5" />}
                {loading ? 'Processing...' : 'Process Batch'}
            </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default BatchPredict;
