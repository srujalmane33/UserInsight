import  { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { formatData } from '../utils/formatData';
import AIInsights from '../components/AIInsights';

export default function DetailedReportPage() {
  const { id } = useParams(); // Grabs the review_id straight out of your browser URL path
  const location = useLocation();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
  if (!id) return;

  let isMounted = true; // Flag to prevent race conditions

  async function loadReportData() {
    try {
      setLoading(true);
      
      const res = await fetch(`http://localhost:5000/api/report/context/${id}`);
      if (!res.ok) throw new Error('Failed to capture document log payload');
      
      const rawActivityObj = await res.json();
      
      // Only update state if the component is still mounted
      if (isMounted) {
        const formattedReport = formatData(rawActivityObj);
        setReport(formattedReport);
      }
    } catch (err) {
      console.error("❌ Error loading report over network pipeline:", err);
      
      // Safe fallback from local router history state if network is broken
      if (isMounted && location.state?.activity) {
        setReport(formatData(location.state.activity));
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadReportData();

  // Cleanup function runs when component unmounts to tear down listeners
  return () => {
    isMounted = false;
  };
      // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]); // 👈 CRITICAL: Completely remove location.state from here to stop the infinite loop!

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 mb-4">Inspection record could not be loaded from network.</p>
        <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 font-sans">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Cleanliness Inspection Report</h1>
            <p className="text-xs text-slate-400 mt-0.5">{report.locationName}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <AIInsights report={report} />
      </main>
    </div>
  );
}