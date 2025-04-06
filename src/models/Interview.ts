// src/models/Interview.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  questions: string[];
  answers: string[];
  feedbacks: { text: string; score?: number; skipped?: boolean }[];
  overallFeedback: string;
  overallScore: number;
  createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  questions: { type: [String], required: true },
  answers: { type: [String], required: true },
  feedbacks: { type: [Object], required: true },
  overallFeedback: { type: String, default: '' },
  overallScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
