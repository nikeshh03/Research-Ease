const API_KEY = 'AIzaSyCCv3NFveJwSw6i96FMRiQXdOsbD7e8Xc0';
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

const ANALYSIS_PROMPT = `Analyze this research paper and provide a structured response in the following JSON format:
{
  "summary": {
    "abstract": "Brief overview of the paper",
    "introduction": "Key background and objectives",
    "methodology": "Research approach and methods used",
    "results": "Main findings",
    "discussion": "Interpretation of results",
    "conclusion": "Final takeaways and implications"
  },
  "keyTerms": [
    {
      "term": "Technical term",
      "explanation": "Simple explanation"
    }
  ],
  "insights": [
    "Key insight 1",
    "Key insight 2"
  ],
  "recommendations": {
    "furtherReading": [
      {
        "title": "Related paper title",
        "authors": "Author names",
        "year": "Publication year",
        "relevance": "Why this paper is relevant",
        "link": "Optional DOI or URL"
      }
    ],
    "researchGaps": [
      "Identified research gap or opportunity"
    ],
    "methodologyTips": [
      "Specific recommendation for improving or extending the methodology"
    ],
    "futureDirections": [
      "Suggested direction for future research"
    ]
  }
}

Ensure the response is detailed and includes:
1. Clear summaries of each section
2. Important technical terms with accessible explanations
3. Key insights from the research
4. 3-5 relevant papers for further reading
5. 2-3 identified research gaps or opportunities
6. 3-4 specific methodology recommendations
7. 2-3 suggested future research directions

Make the analysis helpful for both new researchers and experts in the field.`;

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

export async function analyzeText(text: string) {
  try {
    await rateLimiter.waitForAvailableSlot();
    
    return await retryWithExponentialBackoff(async () => {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: ANALYSIS_PROMPT },
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
  } catch (error) {
    console.error('Error analyzing text:', error);
    if (error.toString().includes('429')) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    }
    throw new Error('Failed to analyze the paper. Please try again.');
  }
}