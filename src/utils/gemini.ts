
import { toast } from "@/components/ui/use-toast";
import { generateAstrologyResponse } from './astrology';

// Gemini API configuration
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Checks if a question is related to astrology
 */
export function isAstrologyQuestion(question: string): boolean {
  // All questions are now considered valid for our cosmic guide
  return true;
}

/**
 * Generates a response using Gemini API for astrological questions
 */
export async function getGeminiAstrologyResponse(
  question: string, 
  apiKey: string,
  userInfo?: {
    dateOfBirth: string;
    location: string;
    birthTime: string;
    gender: string;
  }
): Promise<string> {
  try {
    // Check if API key is provided
    if (!apiKey) {
      return "I need a valid Gemini API key to consult the stars. Please provide one in the settings.";
    }
    
    const fullUrl = `${API_URL}?key=${apiKey}`;
    
    let userInfoString = '';
    if (userInfo) {
      userInfoString = `
      The person asking has provided the following information:
      Date of Birth: ${userInfo.dateOfBirth}
      Birth Time: ${userInfo.birthTime}
      Birth Location: ${userInfo.location}
      Gender: ${userInfo.gender}
      `;
    }
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a trained expert in vedic astrology. Provide prediction about the question below with minor details as summary.
                ${userInfoString}
                Question: "${question}"`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini");
    }
    
    return responseText;
  } catch (error) {
    console.error("Error getting astrology response:", error);
    toast({
      title: "Cosmic Interference",
      description: "The stars are temporarily obscured. Please try again later.",
      variant: "destructive"
    });
    
    // Use the local astrology response generator as fallback
    return generateFallbackResponse(question);
  }
}

// Fallback to local response generation if API fails
function generateFallbackResponse(question: string): string {
  try {
    return generateAstrologyResponse(question);
  } catch (e) {
    // If there's an error with the import, use a simple fallback
    console.error("Error using fallback generator:", e);
    return "The cosmic energies are unsettled at the moment. The stars will align soon to provide you with guidance.";
  }
}
