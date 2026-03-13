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
You are an AI civic complaint analyzer.

Analyze the complaint and determine:

1. Which category the issue belongs to:
Infrastructure, Sanitation, Utilities, Transportation, Public Services

2. Which department is responsible:
- Infrastructure → BBMP Infrastructure
- Sanitation → BBMP Waste Management
- Utilities → BESCOM / BWSSB
- Transportation → Traffic Police
- Public Services → Municipal Services

3. The urgency level:
Low, Medium, High, Critical

4. Whether the complaint is fake or invalid.
Mark complaint as fake if:
- complaint is unrelated to civic issues
- random text
- abusive language
- personal complaints
- advertisements
- nonsense sentences

Complaint:
"${description}"

Respond ONLY in JSON format:
{
  "category": "...",
  "department": "...",
  "priority": "...",
  "isFake": boolean,
  "reason": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract JSON (handling potential markdown formatting)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiResult = JSON.parse(jsonMatch[0]);
      console.log("AI classification:", aiResult);
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
