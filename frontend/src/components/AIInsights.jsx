
import ScoreCard from './ScoreCard';
import InsightCard from './InsightCard';
import SummaryCard from './SummaryCard';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function AIInsights({ report }) {
  if (!report) return null;

  const getProgressColor = (score) => {
    if (score === null) return 'bg-gray-200';
    if (score < 5.0) return 'bg-red-500';
    if (score < 8.5) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <ScoreCard 
          score={report.score} 
          imagesCount={report.imagesCount} 
          modelVersion={report.modelVersion} 
        />

        {/* Categories Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Score Breakdown</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(report.summary).map(([key, val], idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                {/* Replaces underscores with spaces for clean presentation text titles */}
                <span className="text-slate-500 w-24 truncate capitalize">{key.replace(/_/g, ' ')}</span>
                <div className="flex-1 mx-3 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(val)}`} 
                    style={{ width: val !== null ? `${val * 10}%` : '0%' }}
                  ></div>
                </div>
                <span className="font-semibold text-slate-700 w-10 text-right">
                  {val !== null ? `${val.toFixed(1)}/10` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER COLUMN */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-900">Why this score? (AI Explainability)</h3>
          </div>

          <div className="flex flex-col gap-4">
            {Object.entries(report.summary)
              .filter(([ val]) => val !== null)
              .map(([key, val], idx) => (
                <InsightCard 
                  key={idx}
                  title={key.replace(/_/g, ' ')}
                  score={val}
                  textExplain={report.explanations[key]}
                />
              ))}
          </div>

          {report.explanations.dynamic_weighting && (
            <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h5 className="text-xs font-bold text-slate-800 mb-1">Dynamic Weighting Applied</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {report.explanations.dynamic_weighting}
              </p>
            </div>
          )}
        </div>

        <SummaryCard images={report.images} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Image Evidence ({report.imagesCount})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.images.map((img, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex flex-col">
                <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center text-slate-400 relative">
                  <PhotoIcon className="w-8 h-8 opacity-40" />
                  
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                    <span className="bg-indigo-600 text-[10px] text-white font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                    <span className="bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {img.image_score?.toFixed(1) || '0.0'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
                    {img.detections?.filter(d => ['Dirty Western', 'Broken Toilet', 'Slippery Floor'].includes(d.label)).slice(0, 2).map((det, tIdx) => {
                      let bg = 'bg-orange-500';
                      if (det.label === 'Slippery Floor') bg = 'bg-blue-500';
                      if (det.label === 'Broken Toilet') bg = 'bg-red-500';
                      return (
                        <span key={tIdx} className={`${bg} text-white text-[8px] font-bold px-1 py-0.5 rounded whitespace-nowrap`}>
                          {det.label.split(' ')[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2 bg-white border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-700 truncate">{img.camera_view || 'Camera View'}</p>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">{img.filename}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}