

export default function InsightCard({ title, score, textExplain }) {
  if (score === null) return null;

  let dotColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-600';
  
  if (score < 5.0) {
    dotColor = 'bg-red-500';
    badgeColor = 'bg-red-50 text-red-600';
  } else if (score < 8.5) {
    dotColor = 'bg-orange-500';
    badgeColor = 'bg-orange-50 text-orange-600';
  }

  return (
    <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
      <div className="flex gap-2.5">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`}></div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 capitalize">{title}</h4>
          <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{textExplain || 'In good condition.'}</p>
        </div>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap ${badgeColor}`}>
        {score.toFixed(1)}/10
      </span>
    </div>
  );
}