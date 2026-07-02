import { useState } from "react";
import AIInsights from "../components/AIInsights";
import useReport from "../hooks /useReport";

const TEST_JSON_DATA = {
  "method": "AI Hygiene Model v1",
  "images_analyzed": 6,
  "ai_response": {
    "overall_score": 7.4,
    "class_scores": {
      "overall": 7.4,
      "floor": 7.7,
      "urinal": 9.4,
      "western_toilet": 9.4,
      "indian_toilet": 9.3,
      "basin": null,
      "shower": null,
      "consumables": 10,
      "safety": 0,
      "infrastructure": 10
    },
    "explainability": {
      "floor": "Floor score reduced to 7.7 due to: 0.84 pts for 10.5% dirty floor area, 1.41 pts for 47.0% wet floor area, 0.02 pts for stain: Dirty Floor (conf: 0.74).",
      "urinal": "Urinal score (9.4) reduced due to: 0.55 pts for stain/dirt on unit 1.",
      "western_toilet": "Western_toilet score (9.4) reduced due to: 0.06 pts for stain/dirt on unit 1, 0.06 pts for stain/dirt on unit 2, 0.06 pts for stain/dirt on unit 3, 0.04 pts for stain/dirt on unit 4, 0.72 pts for breakage on unit 1, 0.72 pts for breakage on unit 2, 0.72 pts for breakage on unit 3.",
      "indian_toilet": "Indian_toilet score (9.3) reduced due to: 0.72 pts for breakage on unit 1, 0.72 pts for breakage on unit 2, 0.72 pts for breakage on unit 3.",
      "consumables": "All soap, tissue, and hand hygiene dispensers are fully stocked.",
      "safety": "Safety score reduced to 0.0 due to: 2.94 pts for Slippery Floor (conf: 0.98), 2.41 pts for Slippery Floor (conf: 0.80), 2.94 pts for Slippery Floor (conf: 0.98), 2.94 pts for Slippery Floor (conf: 0.98), 2.47 pts for Slippery Floor (conf: 0.82), 2.94 pts for Slippery Floor (conf: 0.98).",
      "infrastructure": "Infrastructure is solid and in good condition.",
      "dynamic_weighting": "Adaptive weight adjustments applied: safety weight ×1.5 (critical: score 0.0); floor weight ×1.2 (extensive wet area: 47% wet)."
    },
    "images": [
      {
        "filename": "image_1.jpg",
        "camera_view": "Western Toilet View",
        "image_score": 8,
        "detections": [
          { "label": "Western Toilet", "type": "fixture", "confidence": 0.99, "bounding_box": "150,150,380,420", "severity": null },
          { "label": "Tissue Dispenser", "type": "fixture", "confidence": 0.94, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Tissue Available", "type": "consumable", "confidence": 0.95, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Dirty Western", "type": "hygiene", "confidence": 0.8318170584358523, "bounding_box": "0,1182,1236,1707", "severity": "severe" },
          { "label": "Slippery Floor", "type": "safety", "confidence": 0.98, "bounding_box": "50,250,450,400", "severity": null }
        ],
        "segmentations": [
          { "class_name": "dirty", "coverage_percentage": 15.81804701230228 },
          { "class_name": "wet", "coverage_percentage": 64.80974480082016 }
        ]
      },
      {
        "filename": "image_2.jpg",
        "camera_view": "Western Toilet View",
        "image_score": 8.8,
        "detections": [
          { "label": "Western Toilet", "type": "fixture", "confidence": 0.99, "bounding_box": "150,150,380,420", "severity": null },
          { "label": "Tissue Dispenser", "type": "fixture", "confidence": 0.94, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Tissue Available", "type": "consumable", "confidence": 0.95, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Dirty Western", "type": "hygiene", "confidence": 0.8454603287932044, "bounding_box": "0,899,784,1707", "severity": "severe" },
          { "label": "Broken Toilet", "type": "damage", "confidence": 0.7187005711775043, "bounding_box": "67,1590,124,1636", "severity": "minor" },
          { "label": "Slippery Floor", "type": "safety", "confidence": 0.8018684552577622, "bounding_box": "50,250,450,400", "severity": null }
        ],
        "segmentations": [
          { "class_name": "dirty", "coverage_percentage": 17.45523945518453 },
          { "class_name": "wet", "coverage_percentage": 10.37369105155243 }
        ]
      },
      {
        "filename": "image_3.jpg",
        "camera_view": "Image 3 View",
        "image_score": 8.1,
        "detections": [
          { "label": "Urinal", "type": "fixture", "confidence": 0.97, "bounding_box": "150,100,350,380", "severity": null },
          { "label": "Partition", "type": "fixture", "confidence": 0.91, "bounding_box": "230,80,250,350", "severity": null },
          { "label": "Dirty Urinal", "type": "hygiene", "confidence": 0.7306234439074399, "bounding_box": "676,1565,1153,1707", "severity": "minor" },
          { "label": "Slippery Floor", "type": "safety", "confidence": 0.98, "bounding_box": "50,250,450,400", "severity": null }
        ],
        "segmentations": [
          { "class_name": "dirty", "coverage_percentage": 3.674813268892794 },
          { "class_name": "wet", "coverage_percentage": 65 }
        ]
      },
      {
        "filename": "image_4.jpg",
        "camera_view": "Western Toilet View",
        "image_score": 8.1,
        "detections": [
          { "label": "Western Toilet", "type": "fixture", "confidence": 0.99, "bounding_box": "150,150,380,420", "severity": null },
          { "label": "Tissue Dispenser", "type": "fixture", "confidence": 0.94, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Tissue Available", "type": "consumable", "confidence": 0.95, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Dirty Western", "type": "hygiene", "confidence": 0.823579836701816, "bounding_box": "0,966,1280,1707", "severity": "severe" },
          { "label": "Broken Toilet", "type": "damage", "confidence": 0.7150478727299355, "bounding_box": "67,1589,124,1636", "severity": "minor" },
          { "label": "Slippery Floor", "type": "safety", "confidence": 0.98, "bounding_box": "50,250,450,400", "severity": null }
        ],
        "segmentations": [
          { "class_name": "dirty", "coverage_percentage": 14.82958040421792 },
          { "class_name": "wet", "coverage_percentage": 62.49539579671939 }
        ]
      },
      {
        "filename": "image_5.jpg",
        "camera_view": "Western Toilet View",
        "image_score": 9,
        "detections": [
          { "label": "Western Toilet", "type": "fixture", "confidence": 0.99, "bounding_box": "150,150,380,420", "severity": null },
          { "label": "Tissue Dispenser", "type": "fixture", "confidence": 0.94, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Tissue Available", "type": "consumable", "confidence": 0.95, "bounding_box": "40,180,90,240", "severity": null },
          { "label": "Dirty Western", "type": "hygiene", "confidence": 0.7560207051845342, "bounding_box": "1083,1210,1280,1707", "severity": "moderate" },
          { "label": "Broken Toilet", "type": "damage", "confidence": 0.715155883860574, "bounding_box": "67,1590,124,1636", "severity": "minor" },
          { "label": "Slippery Floor", "type": "safety", "confidence": 0.8230870588019918, "bounding_box": "50,250,450,400", "severity": null }
        ],
        "segmentations": [
          { "class_name": "dirty", "coverage_percentage": 6.722484622144113 },
          { "class_name": "wet", "coverage_percentage": 14.61741176039836 }
        ]
      },
      {
        "filename": "image_6.jpg",
        "camera_view": "Image 6 View",
        "image_score": 7.7,
        "detections": [
          { "label": "Door", "type": "fixture", "confidence": 0.92, "bounding_box": "100,50,220,400", "severity": null },
          { "label": "Waste Bin", "type": "fixture", "confidence": 0.88, "bounding_box": "450,320,520,420", "severity": null },
          { "label": "Dirty Floor", "type": "hygiene", "confidence": 0.739543057996485, "bounding_box": "136,1522,534,1707", "severity": "minor" },
          { "label": "Slippery Floor", "type": "safety", "confidence": 0.98, "bounding_box": "50,250,450,400", "severity": null }
        ],
        "segmentations": [
          { "class_name": "dirty", "coverage_percentage": 4.745166959578207 },
          { "class_name": "wet", "coverage_percentage": 65 }
        ]
      }
    ]
  },
  "computed_at": "2026-06-30T06:14:34.604Z"
};

function DashBoard() {
  const [jsonInput, setJsonInput] = useState("");
  const { report, loading, error, fetchReport } = useReport();

  const handleLoadTest = () => {
    setJsonInput(JSON.stringify(TEST_JSON_DATA, null, 2));
  };

  const handleSubmit = async () => {
    if (!jsonInput.trim()) {
      alert("Please enter inspection JSON data.");
      return;
    }
    try {
      const parsedJson = JSON.parse(jsonInput);
      await fetchReport(parsedJson);
    } catch (e) {
      alert("Invalid JSON format. Please ensure brackets, quotes, and commas are correct.");
    }
  };

  const handleBack = () => {
    // Reset report state to go back to input editor
    window.location.reload(); // Quick reset of hook states
  };

  // 1. Loading screen
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p className="loading-text">Analyzing washroom hygiene telemetries...</p>
      </div>
    );
  }

  // 2. Report dashboard screen
  if (report) {
    return <AIInsights report={report} onBack={handleBack} />;
  }

  // 3. Raw JSON Input screen
  return (
    <div className="input-area-container animate-fade-in">
      <div className="input-area-header">
        <h2>AI Washroom Inspector</h2>
        <p>Paste raw inspection log files or load the test dataset to generate cleanliness and explainability dashboards.</p>
      </div>

      <div className="json-textarea-wrapper">
        <textarea
          className="json-textarea"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste your JSON inspection logs here... e.g.
{
  "method": "AI Hygiene Model v1",
  "images_analyzed": 6,
  "ai_response": { ... }
}'
        />
      </div>

      {error && (
        <div style={{ color: "var(--error)", background: "var(--error-bg)", border: "1px solid var(--error-border)", padding: "12px 16px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" }}>
          {error}
        </div>
      )}

      <div className="input-actions-row">
        <button onClick={handleLoadTest} className="btn-secondary">
          Load Test JSON
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Generate Insights
        </button>
      </div>
    </div>
  );
}

export default DashBoard;