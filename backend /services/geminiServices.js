const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Simplifies a raw technical explainability object using Gemini
 * @param {Object} explainabilityObj - The raw technical explanations from the upstream API
 * @returns {Object} Clean, user-friendly summarized text descriptions mapped by category
 */
async function simplifyExplanations(explainabilityObj) {
  try {
    if (!explainabilityObj || Object.keys(explainabilityObj).length === 0) {
      console.warn(`⚠️ [${new Date().toLocaleTimeString()}] simplifyExplanations called with an empty or missing object.`);
      return {};
    }

    const systemPrompt = `
      You are an expert operations assistant specializing in facility hygiene and cleanliness audits.
      Your task is to translate raw, messy, highly technical automated AI detection strings into clear, 
      professional, polite, and brief (1-2 sentences max) operational summaries for a supervisor.

      Follow these instructions strictly:
      1. Explain *why* points were deducted if deductions are mentioned.
      2. If a section has no deductions, explicitly note that it is clean, compliant, or well-maintained.
      3. Do NOT include messy score strings or weight factors (e.g., avoid writing "0.55 pts for 6.9% area" or "weight 4"). Say "minor wet patches found" or "localized stains noted" instead.
      4. You MUST return your answer strictly as a valid JSON object matching the exact keys passed to you.
      5. Do not wrap the JSON output in markdown blocks like \`\`\`json. Output ONLY raw JSON text string format.
    `;

    const userContent = `
      Here is the raw technical data object to simplify:
      ${JSON.stringify(explainabilityObj, null, 2)}
    `;

    // 📤 OUTBOUND DATA LOG
    console.log("==================================================================");
    console.log(`🛫 [${new Date().toLocaleTimeString()}] Sending payload dataset to Gemini API...`);
    console.log("==================================================================");
    console.log(JSON.stringify(explainabilityObj, null, 2));
    console.log("==================================================================\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Gemini returned an empty text response stream");
    }

    const parsedJson = JSON.parse(responseText);

    // 📥 INBOUND RESPONSE LOG
    console.log("==================================================================");
    console.log(`🛬 [${new Date().toLocaleTimeString()}] Fresh Response received from Gemini!`);
    console.log("==================================================================");
    console.log(JSON.stringify(parsedJson, null, 2));
    console.log("==================================================================\n");

    return parsedJson;

  } catch (error) {
    // 🚨 FAILURE CONSOLE LOG
    console.error("==================================================================");
    console.error(`🚨 [${new Date().toLocaleTimeString()}] Gemini Service Request FAILED!`);
    console.error("==================================================================");
    console.error(`Reason: ${error.message}`);
    console.error("Falling back to raw technical data object to keep front-end alive.");
    console.error("==================================================================\n");
    
    return explainabilityObj; 
  }
}

module.exports = {
  simplifyExplanations
};