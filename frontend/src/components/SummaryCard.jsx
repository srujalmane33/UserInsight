

export default function SummaryCard({ images = [] }) {
  const primaryImage = images[0] || {};
  
  const wetPct = primaryImage.segmentations?.find(s => s.class_name === 'wet')?.coverage_percentage || 0;
  const dirtyPct = primaryImage.segmentations?.find(s => s.class_name === 'dirty')?.coverage_percentage || 0;

  let totalSlippery = 0;
  let totalBroken = 0;

  images.forEach(img => {
    img.detections?.forEach(det => {
      if (det.label === 'Slippery Floor') totalSlippery++;
      if (det.label === 'Broken Toilet') totalBroken++;
    });
  });

  const metrics = [
    { val: `${wetPct.toFixed(0)}%`, label: 'Wet Floor Area', color: 'text-slate-800' },
    { val: `${dirtyPct.toFixed(1)}%`, label: 'Dirty Floor Area', color: 'text-slate-800' },
    { val: totalSlippery, label: 'Slippery Detections', color: 'text-red-500' },
    { val: totalBroken, label: 'Breakages Detected', color: 'text-orange-500' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Insights Summary</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center flex flex-col justify-center min-h-[85px]">
            <span className={`text-lg font-black block ${m.color}`}>{m.val}</span>
            <span className="text-[10px] font-medium text-slate-400 leading-tight mt-1">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}