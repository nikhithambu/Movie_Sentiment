
import { GoogleGenAI, Type } from "@google/genai";
import { MovieAnalysis } from "../types";

export const analyzeMovie = async (input: string): Promise<MovieAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Analyze the following movie title or story plot: "${input}". 
  Provide a detailed evaluation of its narrative quality and its potential impact on societal development.
  Be critical but fair. If only a title is provided, use your internal knowledge of the movie.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          overallSentiment: { type: Type.STRING, description: "One of: Positive, Mixed, Negative" },
          sentimentScore: { type: Type.NUMBER, description: "Scale 0-100" },
          storyQualityScore: { type: Type.NUMBER, description: "Scale 0-100" },
          societalImpactScore: { type: Type.NUMBER, description: "Scale 0-100" },
          summary: { type: Type.STRING },
          narrativeAnalysis: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              pacing: { type: Type.STRING },
              characterDepth: { type: Type.STRING },
            },
            required: ["strengths", "weaknesses", "pacing", "characterDepth"]
          },
          societalDevelopment: {
            type: Type.OBJECT,
            properties: {
              contributionToSociety: { type: Type.STRING },
              keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
              potentialPositiveImpact: { type: Type.ARRAY, items: { type: Type.STRING } },
              potentialNegativeInfluences: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["contributionToSociety", "keyThemes", "potentialPositiveImpact", "potentialNegativeInfluences"]
          },
          finalVerdict: { type: Type.STRING }
        },
        required: [
          "title", 
          "overallSentiment", 
          "sentimentScore", 
          "storyQualityScore", 
          "societalImpactScore", 
          "summary", 
          "narrativeAnalysis", 
          "societalDevelopment", 
          "finalVerdict"
        ]
      }
    }
  });

  const result = JSON.parse(response.text);
  return result as MovieAnalysis;
};
