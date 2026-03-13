/**
 * Keyword-based category classifier for civic complaints.
 * Provides high-accuracy matching for common infrastructure and utility issues.
 */

const keywordMap = {
  Infrastructure: ['road', 'pothole', 'bridge', 'footpath', 'drainage', 'pavement', 'flyover'],
  Sanitation: ['garbage', 'trash', 'waste', 'sewage', 'dustbin', 'litter', 'cleaning', 'drain'],
  Utilities: ['water', 'pipeline', 'leak', 'electricity', 'transformer', 'power', 'pipe', 'voltage'],
  Transportation: ['traffic', 'signal', 'congestion', 'parking', 'one-way', 'speed breaker'],
  'Public Services': ['streetlight', 'park', 'public toilet', 'playground', 'library', 'bench']
};

/**
 * Detects the category of a complaint based on keywords.
 * @param {string} text - The complaint description.
 * @returns {string|null} - The detected category or null if no match.
 */
const detectCategoryByKeywords = (text) => {
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

module.exports = { detectCategoryByKeywords };
