const OpenAI = require("openai");

// Initialize the OpenAI instance targeted directly at the ultra-fast Groq hardware architecture
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // 👈 Points directly to Groq Cloud API
});

/**
 * Simplifies a raw technical explainability object using Groq AI
 * @param {Object} explainabilityObj - The raw technical explanations from the upstream API
 * @returns {Object} Clean, user-friendly summarized text descriptions mapped by category
 */
async function simplifyExplanations(explainabilityObj) {
  try {
    if (!explainabilityObj || Object.keys(explainabilityObj).length === 0) {
      console.warn(`⚠️ [${new Date().toLocaleTimeString()}] simplifyExplanations called with an empty object.`);
      return {};
    }

    const systemPrompt = `
      You are an expert operations assistant specializing in facility hygiene and cleanliness audits.
      Your task is to translate raw, messy, highly technical automated AI detection strings into clear, 
      professional, polite, and brief (1-2 sentences max) operational summaries for a supervisor.

      Follow these instructions strictly:
      1. Explain *why* points were deducted if deductions are mentioned.
      2. If a section has no deductions, explicitly note that it is clean, compliant, or well-maintained.
      3. Do NOT include messy score strings or weight factors (e.g., avoid writing "0.55 pts for 6.9% area"). Say "minor wet patches found" or "localized stains noted" instead.
      4. You MUST return your answer strictly as a valid JSON object matching the exact keys passed to you.
      5. Do not wrap the JSON output in markdown blocks like \`\`\`json. Output ONLY raw JSON text string format.
    `;

    // 📤 OUTBOUND DATA LOG
    console.log("==================================================================");
    console.log(`\n🛫 [${new Date().toLocaleTimeString()}] Sending payload dataset to Groq AI...`);
    console.log("==================================================================");
    console.log(JSON.stringify(explainabilityObj, null, 2));
    console.log("==================================================================\n");

    // Call the Groq system using high-throughput open weights models
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // High intelligence reasoning model on Groq
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(explainabilityObj, null, 2) }
      ],
      // Force native JSON formatting directly out of Groq's compiler pipeline
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0]?.message?.content?.trim();
    if (!responseText) {
      throw new Error("Groq API returned an empty completion structure response");
    }

    const parsedJson = JSON.parse(responseText);

    // 📥 INBOUND RESPONSE LOG
    console.log("==================================================================");
    console.log(`🛬 [${new Date().toLocaleTimeString()}] Fresh Response received from Groq AI!`);
    console.log("==================================================================");
    console.log(JSON.stringify(parsedJson, null, 2));
    console.log("==================================================================\n");

    return parsedJson;

  } catch (error) {
    // 🚨 FAILURE CONSOLE LOG
    console.error("==================================================================");
    console.error(`🚨 [${new Date().toLocaleTimeString()}] Groq AI Service Request FAILED!`);
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