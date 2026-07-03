
import { StarIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

export default function ScoreCard({ score = 0, imagesCount = 0, modelVersion = 'N/A' }) {
  const displayScore = score.toFixed(1);
  
  let statusText = 'Good condition';
  let statusColor = 'text-emerald-500';
  let starCount = 5;

  if (score < 6.0) {
    statusText = 'Urgent attention required';
    statusColor = 'text-red-500';
    starCount = 2;
  } else if (score < 8.5) {
    statusText = 'Good, but needs attention';
    statusColor = 'text-orange-500';
    starCount = 4;
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
      <h3 className="text-sm font-bold text-slate-900 self-start mb-4">Overall Hygiene Score</h3>
      
      <div className="relative w-24 h-24 flex items-center justify-center mb-3">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        <div className="text-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">{displayScore}</span>
          <span className="text-xs text-slate-400 block border-t border-slate-100 pt-0.5">/10</span>
        </div>
      </div>

      <div className="flex gap-2 w-full justify-center mb-4">
        <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2 text-left flex-1 border border-slate-100">
          <PhotoIcon className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-800">{imagesCount}</p>
            <p className="text-[10px] text-slate-400 leading-tight">Images</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2 text-left flex-1 border border-slate-100">
          <DocumentTextIcon className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-800 truncate max-w-[70px]">Model</p>
            <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[70px]">{modelVersion}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className={`w-4 h-4 ${i < starCount ? 'text-amber-400' : 'text-slate-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${statusColor}`}>{statusText}</p>
    </div>
  );
}