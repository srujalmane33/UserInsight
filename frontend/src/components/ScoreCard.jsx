function ScoreCard({ score = 7.4, imagesCount = 6, modelVersion = "AI Hygiene Model v1" }) {
  // SVG configuration
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Score mapping (from 0-10) to progress circle
  const strokeDashoffset = circumference - (Math.min(Math.max(score, 0), 10) / 10) * circumference;

  // Star rating calculation (scale of 0-5 stars from 0-10 score)
  const starValue = score / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(starValue)) {
      stars.push("filled");
    } else if (i === Math.ceil(starValue) && starValue % 1 >= 0.25 && starValue % 1 <= 0.75) {
      stars.push("half-filled");
    } else if (i === Math.ceil(starValue) && starValue % 1 > 0.75) {
      stars.push("filled");
    } else {
      stars.push("empty");
    }
  }

  // Status text mapping
  let statusText = "Good, but needs attention";
  let statusColor = "#f97316"; // orange
  if (score >= 9.0) {
    statusText = "Excellent hygiene condition";
    statusColor = "var(--success)";
  } else if (score < 5.0) {
    statusText = "Needs urgent attention";
    statusColor = "var(--error)";
  }

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">Overall Hygiene Score</h3>
      </div>
      
      <div className="score-card-content">
        {/* Radial Progress Gauge */}
        <div className="gauge-wrapper">
          <div className="radial-progress">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="#f1f3f9"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#scoreGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-center-text">
              <div className="gauge-score">{score.toFixed(1)}</div>
              <div className="gauge-max">/10</div>
            </div>
          </div>
        </div>

        {/* Meta Statistics */}
        <div className="meta-stats">
          <div className="meta-stat-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <div className="meta-stat-info">
              <span className="meta-stat-value">{imagesCount}</span>
              <span className="meta-stat-label">Images Analyzed</span>
            </div>
          </div>
          <div className="meta-stat-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
              <rect x="9" y="9" width="6" height="6"/>
              <line x1="9" y1="1" x2="9" y2="4"/>
              <line x1="15" y1="1" x2="15" y2="4"/>
              <line x1="9" y1="20" x2="9" y2="23"/>
              <line x1="15" y1="20" x2="15" y2="23"/>
              <line x1="20" y1="9" x2="23" y2="9"/>
              <line x1="20" y1="15" x2="23" y2="15"/>
              <line x1="1" y1="9" x2="4" y2="9"/>
              <line x1="1" y1="15" x2="4" y2="15"/>
            </svg>
            <div className="meta-stat-info">
              <span className="meta-stat-value">AI Model</span>
              <span className="meta-stat-label">{modelVersion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stars rating display */}
      <div className="stars-wrapper">
        {stars.map((type, index) => (
          <span key={index} className={`star ${type}`}>
            ★
          </span>
        ))}
      </div>

      {/* Status string */}
      <div className="score-status-text" style={{ color: statusColor }}>
        {statusText}
      </div>
    </div>
  );
}

export default ScoreCard;