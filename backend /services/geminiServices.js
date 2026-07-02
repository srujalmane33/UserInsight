const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateInsights(jsonData) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
You are an advanced AI washroom cleanliness inspector.
Your task is to analyze the input JSON and return a structured cleanliness and safety report.

Input JSON:
${JSON.stringify(jsonData)}

How to process:
1. If the input JSON is already analyzed (i.e., contains "ai_response" or "overall_score" with a pre-existing "explainability" object):
   - Keep the "method", "images_analyzed", "overall_score", "class_scores", "images", and "computed_at" values exactly as they are in the input.
   - For each explanation in the "explainability" object (e.g., floor, urinal, western_toilet, indian_toilet, consumables, safety, infrastructure, dynamic_weighting), use AI to SUMMARIZE and REWRITE it into very simple, clean, plain English that is easy for cleaners to read. Make the explanations clear, friendly, and actionable (e.g. "Score reduced due to stains on 4 units and breakages on 3 units" or "All dispensers fully stocked").
   - Do NOT change the scores or the values of the metrics.
   - Return the structured JSON with your AI-summarized "explainability" object.

2. If the input JSON is raw/un-analyzed inspection logs:
   - Perform the full inspection analysis of cleanliness and safety.
   - Compute scores, determine class scores, detect issues, and write explanations for each category in simple, actionable plain English.
   - Return the full structured JSON matching the schema below.

Output JSON Schema:
{
  "method": "AI Hygiene Model v1",
  "images_analyzed": number of images,
  "ai_response": {
    "overall_score": number (0 to 10),
    "class_scores": {
      "overall": number (0 to 10),
      "floor": number or null,
      "urinal": number or null,
      "western_toilet": number or null,
      "indian_toilet": number or null,
      "basin": number or null,
      "shower": number or null,
      "consumables": number or null,
      "safety": number or null,
      "infrastructure": number or null
    },
    "explainability": {
      "floor": "string explaining floor score deductions in easy plain English",
      "urinal": "string explaining urinal score deductions in easy plain English",
      "western_toilet": "string explaining western toilet score deductions in easy plain English",
      "indian_toilet": "string explaining squat/indian toilet score deductions in easy plain English",
      "consumables": "string explaining consumables status in easy plain English",
      "safety": "string explaining safety score deductions in easy plain English",
      "infrastructure": "string explaining infrastructure status in easy plain English",
      "dynamic_weighting": "string explaining adaptive weighting adjustments applied in easy plain English"
    },
    "images": [
      {
        "filename": "string matching image filename, e.g. image_1.jpg",
        "camera_view": "string matching view, e.g. Western Toilet View",
        "image_score": number,
        "detections": [
          {
            "label": "string",
            "type": "string",
            "confidence": number,
            "bounding_box": "string",
            "severity": "string or null"
          }
        ],
        "segmentations": [
          {
            "class_name": "string",
            "coverage_percentage": number
          }
        ]
      }
    ]
  },
  "computed_at": "ISO timestamp string"
}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generateInsights };