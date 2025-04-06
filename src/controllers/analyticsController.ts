// src/controllers/analyticsController.ts
import { Request, Response, NextFunction } from 'express';
import Interview, { IInterview } from '../models/Interview';
import SavedQuestion from '../models/SavedQuestion';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    // Fetch interview sessions for the user
    const interviews: IInterview[] = await Interview.find({ userId });
    const completedInterviews = interviews.length;
    
    let totalScore = 0;
    let highestScore = 0;
    let scoreCount = 0;
    
    interviews.forEach(interview => {
      // Check if overallScore exists and is a valid number
      if (interview.overallScore !== undefined && 
          interview.overallScore !== null && 
          !isNaN(interview.overallScore) && 
          interview.overallScore > 0) {
        totalScore += interview.overallScore;
        scoreCount++;
        if (interview.overallScore > highestScore) highestScore = interview.overallScore;
      }
    });
    
    // Format scores for display - ensure they're not 'N/A' if valid scores exist
    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount).toString() : 'N/A';
    const highestScoreDisplay = highestScore > 0 ? Math.round(highestScore).toString() : 'N/A';
    
    // Count saved questions from the SavedQuestion collection
    const savedQuestionsCount = await SavedQuestion.countDocuments({ userId });
    
    const analytics = {
      completedInterviews,
      averageScore,
      highestScore: highestScoreDisplay,
      savedQuestions: savedQuestionsCount,
      interviews
    };
    
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};
