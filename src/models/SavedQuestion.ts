import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedQuestion extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  feedback?: {
    text: string;
    score?: number;
  };
  createdAt: Date;
}

const SavedQuestionSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  feedback: {
    text: { type: String, default: "" },
    score: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISavedQuestion>('SavedQuestion', SavedQuestionSchema);
