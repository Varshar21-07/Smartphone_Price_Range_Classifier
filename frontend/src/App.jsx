import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Result from './pages/Result';
import Admin from './pages/Admin';
import BatchPredict from './pages/BatchPredict';
import { predictSingle, getMetrics } from './services/api';

function App() {
  const [page, setPage] = useState('landing');
  const [specs, setSpecs] = useState(null);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    const data = await getMetrics();
    if (data) setMetrics(data);
  };

  const handlePredict = async (inputSpecs) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictSingle(inputSpecs);
      setSpecs(inputSpecs);
      setResult(data);
      setPage('result');
      // Update metrics after a new prediction
      fetchMetrics();
    } catch (err) {
      setError('Failed to process prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return (
          <Home 
            onStart={() => setPage('predict')} 
            onBatch={() => setPage('batch')} 
            onMetrics={() => setPage('admin')}
          />
        );
      case 'predict':
        return <Predict onPredict={handlePredict} isLoading={loading} />;
      case 'batch':
        return <BatchPredict onGoHome={() => setPage('landing')} />;
      case 'result':
        return (
          <Result 
            specs={specs} 
            result={result} 
            onTryAgain={() => setPage('predict')} 
            onGoHome={() => setPage('landing')} 
          />
        );
      case 'admin':
        return <Admin metrics={metrics} />;
      default:
        return (
          <Home 
            onStart={() => setPage('predict')} 
            onBatch={() => setPage('batch')} 
            onMetrics={() => setPage('admin')}
          />
        );
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {renderPage()}

      {/* Admin Toggle - Hidden floating button */}
      <button 
        onClick={() => setPage(page === 'admin' ? 'landing' : 'admin')}
        className="fixed bottom-4 right-4 text-[10px] text-slate-700 hover:text-slate-500 transition-colors uppercase tracking-[0.3em]"
      >
        {page === 'admin' ? 'Back' : 'System Metrics'}
      </button>
    </Layout>
  );
}

export default App;
