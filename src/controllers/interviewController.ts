// src/controllers/interviewController.ts
import { Request, Response } from 'express';
import { AIService } from '../services/AIservice';
import Interview, { IInterview } from '../models/Interview';

interface ProcessedFeedback {
  text: string;
  score?: number;
  skipped?: boolean;
}

export const generateQuestion = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const question = await AIService.generateInterviewQuestion({ prompt });
    res.json({ question });
  } catch (error) {
    console.error("InterviewController generateQuestion error:", error);
    res.status(500).json({ message: 'Error generating question.' });
  }
};

export const evaluateAnswer = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const prompt = `Evaluate the following answer:\nQuestion: ${question}\nAnswer: ${answer}\nProvide constructive feedback and a score in the format "Feedback: ... Score: X".`;
    const feedbackText = await AIService.evaluateAnswer({ prompt });
    
    let score: number | undefined = undefined;
    const scoreMatch = feedbackText.match(/Score:\s*(\d+)/i);
    if (scoreMatch && scoreMatch[1]) {
      score = parseInt(scoreMatch[1], 10);
    }
    
    const feedback = {
      text: feedbackText,
      score: score
    };
    
    res.json({ feedback });
  } catch (error) {
    console.error("InterviewController evaluateAnswer error:", error);
    res.status(500).json({ message: 'Error evaluating answer.' });
  }
};

export const storeInterviewSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { questions, answers, feedbacks, overallFeedback } = req.body;
    
    const processedFeedbacks: ProcessedFeedback[] = feedbacks.map((fb: any) => {
      if (typeof fb === 'string') {
        const scoreMatch = fb.match(/Score:\s*(\d+)/i);
        return {
          text: fb,
          score: scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1], 10) : undefined
        };
      } else if (fb && typeof fb === 'object') {
        let score = undefined;
        if (typeof fb.score === 'number') {
          score = fb.score;
        } else if (fb.score && typeof fb.score === 'string') {
          score = parseInt(fb.score, 10);
        } else if (fb.text && typeof fb.text === 'string') {
          const scoreMatch = fb.text.match(/Score:\s*(\d+)/i);
          if (scoreMatch && scoreMatch[1]) {
            score = parseInt(scoreMatch[1], 10);
          }
        }
        
        return {
          text: fb.text || '',
          score: !isNaN(score) ? score : undefined,
          skipped: fb.skipped
        };
      }
      return { text: '', score: undefined };
    });
    
    const scores = processedFeedbacks
      .map((fb: ProcessedFeedback) => fb.score)
      .filter((score: number | undefined): score is number => 
        typeof score === 'number' && !isNaN(score));
    
    const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    const interviewData: Partial<IInterview> = {
      userId: user.id,
      questions,
      answers,
      feedbacks: processedFeedbacks,
      overallFeedback,
      overallScore
    };
    
    const interview = new Interview(interviewData);
    await interview.save();
    
    res.status(201).json({ message: 'Interview session saved successfully.', interview });
  } catch (error) {
    console.error("Error storing interview session:", error);
    res.status(500).json({ message: 'Error storing interview session.' });
  }
};