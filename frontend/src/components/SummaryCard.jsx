function SummaryCard({ floorExplain = "", images = [] }) {
  // Helper to extract percentages using Regex
  const extractPercentage = (text, type) => {
    if (!text) return null;
    const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*%\\s*${type}`, "i");
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : null;
  };

  const wetArea = extractPercentage(floorExplain, "wet") ?? 47.0;
  const dirtyArea = extractPercentage(floorExplain, "dirty") ?? 10.5;

  // Dynamically count slippery detections across all images
  const slipperyDetections = images.reduce((acc, img) => {
    const count = img.detections?.filter(d => 
      d.label?.toLowerCase().includes("slippery") || 
      d.type?.toLowerCase() === "safety"
    ).length || 0;
    return acc + count;
  }, 0);

  // Dynamically count breakage/damage detections across all images
  const breakages = images.reduce((acc, img) => {
    const count = img.detections?.filter(d => 
      d.label?.toLowerCase().includes("broken") || 
      d.label?.toLowerCase().includes("breakage") ||
      d.type?.toLowerCase() === "damage"
    ).length || 0;
    return acc + count;
  }, 0);

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">Insights Summary</h3>
      </div>
      
      <div className="summary-metrics-grid">
        {/* Wet Floor Area */}
        <div className="summary-metric-card">
          <div className="metric-header blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div className="metric-value">{wetArea}%</div>
          <div className="metric-label">Wet Floor Area</div>
        </div>

        {/* Dirty Floor Area */}
        <div className="summary-metric-card">
          <div className="metric-header orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          </div>
          <div className="metric-value">{dirtyArea}%</div>
          <div className="metric-label">Dirty Floor Area</div>
        </div>

        {/* Slippery Floor */}
        <div className="summary-metric-card">
          <div className="metric-header red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="metric-value">{slipperyDetections}</div>
          <div className="metric-label">Slippery Floor Detections</div>
        </div>

        {/* Toilet Breakages */}
        <div className="summary-metric-card">
          <div className="metric-header orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div className="metric-value">{breakages}</div>
          <div className="metric-label">Toilet Breakages Detected</div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;