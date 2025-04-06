// src/services/AIService.ts
import axios from 'axios';

interface InterviewParams {
  prompt: string;
}

interface EvaluationParams {
  prompt: string;
}

export const AIService = {
  generateInterviewQuestion: async ({ prompt }: InterviewParams): Promise<string> => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            { parts: [{ text: prompt }] }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log("Gemini response (question):", response.data);
      // Modified extraction: look in candidates[0].content.parts[0].text
      const question = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!question) throw new Error("No generated text in response.");
      return question;
    } catch (error) {
      console.error('Error generating interview question:', error);
      throw new Error('Failed to generate interview question.');
    }
  },


  evaluateAnswer: async ({ prompt }: EvaluationParams): Promise<string> => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            { parts: [{ text: prompt }] }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      // console.log("Gemini response (evaluation):", response.data);
      // Modified extraction for evaluation feedback:
      const feedback = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!feedback) throw new Error("No feedback text in response.");
      return feedback;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      throw new Error('Failed to evaluate answer.');
    }
  },
};
