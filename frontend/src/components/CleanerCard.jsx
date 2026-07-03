
import { MapPinIcon, PhotoIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';

export default function CleanerCard({ item, onViewReport }) {
  const cleanerName = item?.cleaner?.name || 'Unknown Cleaner';
  const locationName = item?.location?.name || 'Unknown Location';
  const rawScore = item?.hygiene_ai?.score ?? item?.activity?.score ?? 0;
  const imagesAnalyzed = item?.hygiene_ai?.details?.images_analyzed || 0;
  const status = item?.activity?.status || 'pending';

  let scoreBg = 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (rawScore < 6.0) {
    scoreBg = 'bg-red-50 text-red-600 border-red-100';
  } else if (rawScore < 8.5) {
    scoreBg = 'bg-orange-50 text-orange-600 border-orange-100';
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-[180px]">
              {cleanerName}
            </h3>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
              <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[160px]">{locationName}</span>
            </div>
          </div>

          <div className={`border px-2.5 py-1 rounded-xl text-center font-mono shrink-0 ${scoreBg}`}>
            <span className="text-sm font-black block leading-tight">{rawScore.toFixed(1)}</span>
            <span className="text-[9px] font-bold block tracking-tight uppercase opacity-80">Score</span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-b border-slate-50 py-3 my-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Status</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold uppercase text-[9px] tracking-wider ${
              status === 'completed' ? 'bg-emerald-100/70 text-emerald-700' : 'bg-amber-100/70 text-amber-700'
            }`}>
              {status}
            </span>
          </div>
          <div className="border-l border-slate-100 pl-4">
            <span className="text-slate-400 block mb-0.5">Evidence</span>
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <PhotoIcon className="w-3.5 h-3.5 text-slate-400" />
              {imagesAnalyzed} Image{imagesAnalyzed !== 1 && 's'}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={onViewReport}
        className="w-full bg-slate-50 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-inner"
      >
        Detailed Report
        <ArrowLongRightIcon className="w-4 h-4 transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}