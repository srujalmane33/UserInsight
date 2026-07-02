const { generateInsights } = require("../services/geminiServices");

const generateReport = async (req, res) => {
  try {
    const jsonData = req.body;

    // Generate insights using Gemini service.
    let insightsText = await generateInsights(jsonData);
    
    // Clean markdown code block fences if Gemini includes them
    if (insightsText.includes("```")) {
      insightsText = insightsText.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    try {
      const parsedInsights = JSON.parse(insightsText);
      
      // Enforce default properties to prevent frontend destructuring crashes
      if (!parsedInsights.ai_response) {
        parsedInsights.ai_response = {};
      }
      
      const resData = parsedInsights.ai_response;
      if (resData.overall_score === undefined) {
        resData.overall_score = resData.class_scores?.overall || 5.0;
      }
      if (!resData.class_scores) {
        resData.class_scores = { overall: resData.overall_score };
      }
      if (!resData.explainability) {
        resData.explainability = {};
      }
      if (!resData.images) {
        resData.images = [];
      }
      
      res.json(parsedInsights);
    } catch (e) {
      console.error("Failed to parse Gemini output as JSON, returning fallback structure.", e);
      res.json({
        method: "AI Hygiene Model v1",
        images_analyzed: 0,
        ai_response: {
          overall_score: 5.0,
          class_scores: { 
            overall: 5.0,
            floor: 5.0,
            urinal: null,
            western_toilet: null,
            indian_toilet: null,
            basin: null,
            shower: null,
            consumables: null,
            safety: null,
            infrastructure: null
          },
          explainability: { 
            floor: "AI Analysis: " + insightsText
          },
          images: []
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { generateReport };