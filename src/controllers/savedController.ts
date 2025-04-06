// src/controllers/savedController.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import SavedQuestion, { ISavedQuestion } from '../models/SavedQuestion';

// Save a question for a user (store the full question text as provided)
export const saveQuestion: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { question, answer } = req.body;
    if (!question) {
      res.status(400).json({ message: "Question is required." });
      return;
    }
    const saved = new SavedQuestion({
      userId: user.id,
      question, // Save the full question text
      answer,
    });
    await saved.save();
    res.status(201).json({ message: "Question saved successfully.", saved });
  } catch (error) {
    next(error);
  }
};

// Get saved questions for the logged-in user
export const getSavedQuestions: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const saved = await SavedQuestion.find({ userId: user.id }).sort({ createdAt: -1 });
    res.json({ saved });
  } catch (error) {
    next(error);
  }
};


// Update an answer (and optionally feedback) for a saved question
export const updateSavedQuestion: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { answer, feedback } = req.body;
    const updated = await SavedQuestion.findOneAndUpdate(
      { _id: id, userId: user.id },
      { answer, feedback },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: "Saved question not found." });
      return;
    }
    res.json({ message: "Saved question updated.", saved: updated });
  } catch (error) {
    next(error);
  }
};
