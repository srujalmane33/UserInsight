const express = require('express');
const router = express.Router();
const { simplifyExplanations } = require('../services/geminiServices');

// 🔍 1. GET ROUTE FOR DETAILED DATA LOG LOOKUPS
router.get('/context/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  console.log(`\n📥 [ROUTE ENTRY] Frontend requested raw context for ID: ${reviewId}`);
  
  try {
    const response = await fetch('https://daily-dash-backend-development.vercel.app/api/ai-insights/context');
    const data = await response.json();
    
    const singleActivity = data?.activities?.find(item => String(item.review_id) === String(reviewId));
    
    if (!singleActivity) {
      console.warn(`⚠️ [ROUTE EXHAUSTED] No object record matches review_id: ${reviewId}`);
      return res.status(404).json({ error: "Report data entry not found" });
    }
    
    console.log(`🚀 [ROUTE SUCCESS] Found matching payload for ID: ${reviewId}. Dispatched to frontend.`);
    return res.json(singleActivity);
  } catch (err) {
    console.error("❌ [ROUTE CRASH] Error loading context item data properties:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 🔍 2. POST ROUTE FOR THE GEMINI COMPRESSION TRANSLATION
router.post('/simplify', async (req, res) => {
  console.log("\n📥 [ROUTE ENTRY] Frontend hit 'POST /api/report/simplify' entry endpoint!");
  
  try {
    const { explainability } = req.body;
    
    if (!explainability) {
      console.warn("⚠️ [ROUTE WARNING] Request arrived but body parameter 'explainability' is missing!");
      return res.status(400).json({ error: "Missing explainability parameters in request body payload" });
    }

    console.log("⚡ [ROUTE HANDLER] Passing dataset to Gemini Service worker wrapper...");
    const simplifiedResult = await simplifyExplanations(explainability);
    
    console.log("🚀 [ROUTE SUCCESS] Gemini processed request completely. Sending text objects back to client.");
    return res.json(simplifiedResult);
    
  } catch (err) {
    console.error("❌ [ROUTE CRASH] Router worker caught unhandled execution crash handler:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;