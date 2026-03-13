const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * AI civic complaint analyzer using Google Gemini.
 * @param {string} description - The complaint text.
 * @returns {Promise<Object>} - { category, department, priority, isFake, reason }
 */
const classifyComplaint = async (description) => {
  try {
    const prompt = `
You are a highly efficient AI civic complaint analyzer for a smart city platform.

Analyze the following complaint description and categorize it based on the following rules:

1. **Categories & Departments Mapping:**
   - **Infrastructure**: Issues related to roads, bridges, potholes, etc. 
     *Dept: BBMP Roads*
   - **Sanitation**: Issues related to garbage, waste, sewage, cleaning, etc. 
     *Dept: BBMP Waste Management*
   - **Utilities**: Issues related to water, electricity, pipelines, transformers, etc. 
     *Dept: BWSSB* (for water/sewage) or *BESCOM* (for electricity)
   - **Transportation**: Issues related to traffic signals, congestion, road signs, etc. 
     *Dept: Traffic Police*
   - **Public Services**: Issues related to streetlights, parks, public toilets, etc. 
     *Dept: BBMP Electrical* (for streetlights) or *Municipal Services*

2. **Semantic Detection Examples:**
   - "pothole", "road damage" -> Category: Infrastructure, Dept: BBMP Roads
   - "garbage", "waste", "trash" -> Category: Sanitation, Dept: BBMP Waste Management
   - "water leakage", "pipeline leak" -> Category: Utilities, Dept: BWSSB
   - "electric transformer", "power outage", "short circuit" -> Category: Utilities, Dept: BESCOM
   - "traffic signal not working", "congestion" -> Category: Transportation, Dept: Traffic Police
   - "streetlight broken", "dark street" -> Category: Public Services, Dept: BBMP Electrical

3. **Urgency Level (Priority):**
   - Low, Medium, High, Critical (Determine based on the severity described).

4. **Validity Check:**
   - Mark as "isFake: true" if the text is random, abusive, unrelated to civic issues, advertisements, or nonsense.

Complaint:
"${description}"

Respond ONLY in JSON format:
{
  "category": "Infrastructure | Sanitation | Utilities | Transportation | Public Services",
  "department": "BBMP Roads | BBMP Waste Management | BWSSB | BESCOM | Traffic Police | BBMP Electrical | Municipal Services",
  "priority": "Low | Medium | High | Critical",
  "isFake": boolean,
  "reason": "Short reason for classification"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract JSON (handling potential markdown formatting)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiResult = JSON.parse(jsonMatch[0]);
      return aiResult;
    }
    
    throw new Error("Could not parse AI response as JSON");
  } catch (error) {
    console.error("AI classification error:", error.message);
    // Fallback behavior
    return {
      category: "Public Services",
      priority: "Medium",
      department: "Municipal Services",
      isFake: false,
      reason: "Fallback triggered due to error"
    };
  }
};

module.exports = { classifyComplaint };
