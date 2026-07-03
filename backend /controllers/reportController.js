// In-memory cache variables for just the raw API data
let reportCache = null;
let cacheExpiryTime = null;
const CACHE_DURATION = 15 * 60 * 1000; 

async function fetchRawData() {
  const response = await fetch('https://daily-dash-backend-development.vercel.app/api/ai-insights/context');
  return await response.json();
}

async function getReportContext(req, res) {
  try {
    const currentTime = Date.now();

    // Serve raw data directly from cache if available
    if (reportCache && cacheExpiryTime && currentTime < cacheExpiryTime) {
      console.log("⚡ Serving raw dashboard data from local memory cache!");
      return res.status(200).json(reportCache);
    }

    console.log("🔄 Cache miss. Fetching clean data from production endpoint...");
    const rawApiResponseData = await fetchRawData(); 

    // Cache the completely clean, untouched data structure
    reportCache = rawApiResponseData;
    cacheExpiryTime = currentTime + CACHE_DURATION;

    return res.status(200).json(rawApiResponseData);
  } catch (error) {
    console.error("❌ Controller wrapper failed:", error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getReportContext
};