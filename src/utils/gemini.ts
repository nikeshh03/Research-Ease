import { AnalysisResult } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

// Specialized prompts for different aspects of analysis
const PROMPTS = {
  summary: `As an academic research expert, analyze this research paper and provide detailed summaries for each section. Focus on:

1. Abstract: Capture the key findings and significance in 2-3 sentences
2. Introduction: Explain the research context, objectives, and significance
3. Methodology: Break down the research approach, methods, and data collection
4. Results: Highlight the key findings and statistical significance
5. Discussion: Explain the interpretation and implications of results
6. Conclusion: Summarize main takeaways and broader impact

Format the response as JSON:
{
  "abstract": "string",
  "introduction": "string",
  "methodology": "string",
  "results": "string",
  "discussion": "string",
  "conclusion": "string"
}`,

  keyTerms: `As a research terminology expert, identify and explain important technical terms from this paper. For each term:

1. Provide a clear, accessible explanation suitable for graduate students
2. Include relevant context from the paper
3. Highlight why this term is important for understanding the research

Format the response as JSON:
{
  "keyTerms": [
    {
      "term": "string",
      "explanation": "string"
    }
  ]
}`,

  insights: `As a research analyst, extract key insights from this paper. Consider:

1. Novel findings or approaches
2. Significant contributions to the field
3. Practical implications
4. Theoretical advancements
5. Methodological innovations

Format the response as JSON:
{
  "insights": [
    "string"
  ]
}`,

  recommendations: `As a research advisor, provide comprehensive recommendations based on this paper. Include:

1. Further Reading:
   - Closely related papers that extend or challenge these findings
   - Seminal works that provide essential background
   - Recent developments in this research area

2. Research Gaps:
   - Unexplored aspects of the topic
   - Limitations in current methodology
   - Potential areas for replication or extension

3. Methodology Tips:
   - Suggestions for improving the research design
   - Alternative approaches to consider
   - Best practices for similar studies

4. Future Directions:
   - Promising research directions
   - Potential applications
   - Emerging trends in the field

Format the response as JSON:
{
  "furtherReading": [
    {
      "title": "string",
      "authors": "string",
      "year": "string",
      "relevance": "string",
      "link": "string"
    }
  ],
  "researchGaps": [
    "string"
  ],
  "methodologyTips": [
    "string"
  ],
  "futureDirections": [
    "string"
  ]
}`
};

// Enhanced rate limiting implementation
class RateLimiter {
  private requestTimes: number[] = [];
  private readonly windowMs = 60000; // 1 minute window
  private readonly maxRequestsPerWindow = 10; // Adjust based on your quota
  private readonly minDelay = 2000; // Minimum 2 seconds between calls
  private lastCallTime = 0;

  async waitForAvailableSlot(): Promise<void> {
    // Clean up old requests
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(time => now - time < this.windowMs);

    // Check if we need to wait for the minimum delay
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minDelay) {
      await this.delay(this.minDelay - timeSinceLastCall);
    }

    // If we've hit the rate limit, wait until we have an available slot
    if (this.requestTimes.length >= this.maxRequestsPerWindow) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = oldestRequest + this.windowMs - now;
      await this.delay(waitTime);
      this.requestTimes.shift(); // Remove the oldest request
    }

    this.requestTimes.push(now);
    this.lastCallTime = now;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const rateLimiter = new RateLimiter();

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (retries >= maxRetries || !error.toString().includes('429')) {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, retries);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

async function makeApiRequest(prompt: string, text: string) {
  await rateLimiter.waitForAvailableSlot();
  
  return retryWithExponentialBackoff(async () => {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { text }
          ]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    let generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Remove markdown code block delimiters before parsing JSON
    generatedText = generatedText.replace(/^```json\n/, '').replace(/\n```$/, '');

    return JSON.parse(generatedText);
  });
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  try {
    // Run all analysis in parallel for better performance
    const [summary, keyTerms, insights, recommendations] = await Promise.all([
      makeApiRequest(PROMPTS.summary, text),
      makeApiRequest(PROMPTS.keyTerms, text),
      makeApiRequest(PROMPTS.insights, text),
      makeApiRequest(PROMPTS.recommendations, text)
    ]);

    // Combine all results into the final analysis
    return {
      summary,
      ...keyTerms,
      ...insights,
      recommendations
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    if (error.toString().includes('429')) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    }
    throw new Error('Failed to analyze the paper. Please try again.');
  }
}