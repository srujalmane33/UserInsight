import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { formatData } from '../utils/formatData';
import AIInsights from '../components/AIInsights';

// Reads dynamically from Vercel's environment variables dashboard
// Falls back to localhost:3000 if running locally
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function DetailedReportPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simplifying, setSimplifying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDataAndSimplify() {
      try {
        setLoading(true);
        let rawActivityObj = location.state?.activity;

        // 1. Fetch raw context dynamically using the environment URL
        if (!rawActivityObj && id) {
          const res = await fetch(`${API_BASE_URL}/api/report/context/${id}`);
          if (res.ok) {
            rawActivityObj = await res.json();
          }
        }

        if (!rawActivityObj) {
          throw new Error("Could not resolve activity context payload");
        }

        if (isMounted) {
          const formattedReport = formatData(rawActivityObj);
          setReport(formattedReport);
          setLoading(false);

          // 2. Trigger the explanation simplification route targeting Groq on Render
          setSimplifying(true);
          const aiRes = await fetch(`${API_BASE_URL}/api/report/simplify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ explainability: formattedReport.explanations })
          });

          if (aiRes.ok && isMounted) {
            const simplifiedTextObj = await aiRes.json();
            
            setReport(prev => ({
              ...prev,
              explanations: simplifiedTextObj
            }));
          }
        }
      } catch (err) {
        console.error("❌ Error running report processing chain:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setSimplifying(false);
        }
      }
    }

    loadDataAndSimplify();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <p className="text-slate-500 mb-4">No report data found. Please select an entry from the dashboard.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 font-sans">
      
      {/* HEADER BAR */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">AI Cleanliness Inspection Report</h1>
              {simplifying && (
                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full animate-pulse tracking-wide">
                  ✨ Optimizing Text Insights...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{report.locationName}</p>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID SYSTEM */}
      <main className="max-w-7xl mx-auto">
        <AIInsights report={report} />
      </main>

    </div>
  );
}