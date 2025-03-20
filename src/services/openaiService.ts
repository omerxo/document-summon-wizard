
import { toast } from 'sonner';

// This would usually be stored in an environment variable
// For a production app, this should be handled on the server side
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const generateSummary = async (text: string): Promise<string> => {
  try {
    const prompt = `
Please provide a comprehensive summary of the following document. 
The summary should:
1. Capture the main points and key information
2. Maintain the original context and intent
3. Be well-structured and easy to read
4. Be around 3-5 paragraphs in length

Here is the document:
${text}
`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using GPT-4o for high-quality summaries
        messages: [
          {
            role: "system",
            content: "You are a professional document summarizer that creates concise, accurate, and well-structured summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, focused output
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate summary");
    }

    const data = await response.json() as OpenAIResponse;
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in generateSummary:", error);
    toast.error("Failed to generate summary. Please try again.");
    throw error;
  }
};
