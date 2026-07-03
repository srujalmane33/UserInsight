import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  PhotoIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import CleanerCard from '../components/CleanerCard';

export default function DashBoard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedCleaner, setSelectedCleaner] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  useEffect(() => {
    fetch('https://daily-dash-backend-development.vercel.app/api/ai-insights/context')
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard context:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 font-mono">Loading Dashboard Context...</p>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const activities = dashboardData?.activities || [];

  const companyOptions = ['All', ...new Set(activities.map(a => String(a.company_id)).filter(Boolean))];
  const cleanerOptions = ['All', ...new Set(activities.map(a => a.cleaner?.name).filter(Boolean))];
  const locationOptions = ['All', ...new Set(activities.map(a => a.location?.name).filter(Boolean))];

  const filteredActivities = activities.filter((activity) => {
    const matchesCompany = selectedCompany === 'All' || String(activity.company_id) === selectedCompany;
    const matchesCleaner = selectedCleaner === 'All' || activity.cleaner?.name === selectedCleaner;
    const matchesLocation = selectedLocation === 'All' || activity.location?.name === selectedLocation;
    return matchesCompany && matchesCleaner && matchesLocation;
  });

  const handleResetFilters = () => {
    setSelectedCompany('All');
    setSelectedCleaner('All');
    setSelectedLocation('All');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <SparklesIcon className="w-7 h-7 text-indigo-600" />
            Washroom AI Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1">Operational inspection intelligence overview</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-xs font-mono text-slate-500">
          Range: {summary.dateRange?.from ? new Date(summary.dateRange.from).toLocaleDateString() : 'N/A'} - {summary.dateRange?.to ? new Date(summary.dateRange.to).toLocaleDateString() : 'N/A'}
        </div>
      </header>

      <section className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-900 leading-none">{summary.totalActivities || 0}</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Total Activities</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-900 leading-none">{summary.cleaners || 0}</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Active Cleaners</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
            <MapPinIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-900 leading-none">{summary.locations || 0}</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Locations Tracked</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
            <PhotoIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-900 leading-none">{summary.companies || 0}</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Registered Groups</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <FunnelIcon className="w-4 h-4 text-slate-400" />
          Filter Options
        </div>
        
        <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
          <div className="flex flex-col min-w-[140px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Group ID</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2 font-medium focus:outline-none focus:border-indigo-500 transition"
            >
              {companyOptions.map((opt, index) => (
                <option key={index} value={opt}>{opt === 'All' ? 'All Groups' : `Group ${opt}`}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col min-w-[160px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Cleaner</label>
            <select
              value={selectedCleaner}
              onChange={(e) => setSelectedCleaner(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2 font-medium focus:outline-none focus:border-indigo-500 transition"
            >
              {cleanerOptions.map((opt, index) => (
                <option key={index} value={opt}>{opt === 'All' ? 'All Cleaners' : opt}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col min-w-[180px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2 font-medium focus:outline-none focus:border-indigo-500 transition"
            >
              {locationOptions.map((opt, index) => (
                <option key={index} value={opt}>{opt === 'All' ? 'All Locations' : opt}</option>
              ))}
            </select>
          </div>

          {(selectedCompany !== 'All' || selectedCleaner !== 'All' || selectedLocation !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="self-end p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition border border-slate-200 border-dashed flex items-center justify-center h-[34px] w-[34px]"
              title="Clear Filters"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">
            Inspection Entries ({filteredActivities.length})
          </h2>
        </div>
        
        {filteredActivities.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 font-medium">
            No matching cleaner inspections found for your selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((item) => (
              <CleanerCard 
                key={item.review_id} 
                item={item} 
                onViewReport={() => navigate(`/report/${item.review_id}`, { state: { activity: item } })}
              />
            ))}
          </div>
        )}
      </main>

    </div>
  );
}