"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeInterviewSession = exports.evaluateAnswer = exports.generateQuestion = void 0;
const AIservice_1 = require("../services/AIservice");
const Interview_1 = __importDefault(require("../models/Interview"));
const generateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        const question = yield AIservice_1.AIService.generateInterviewQuestion({ prompt });
        res.json({ question });
    }
    catch (error) {
        console.error("InterviewController generateQuestion error:", error);
        res.status(500).json({ message: 'Error generating question.' });
    }
});
exports.generateQuestion = generateQuestion;
const evaluateAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer } = req.body;
        const prompt = `Evaluate the following answer:\nQuestion: ${question}\nAnswer: ${answer}\nProvide constructive feedback and a score in the format "Feedback: ... Score: X".`;
        const feedbackText = yield AIservice_1.AIService.evaluateAnswer({ prompt });
        let score = undefined;
        const scoreMatch = feedbackText.match(/Score:\s*(\d+)/i);
        if (scoreMatch && scoreMatch[1]) {
            score = parseInt(scoreMatch[1], 10);
        }
        const feedback = {
            text: feedbackText,
            score: score
        };
        res.json({ feedback });
    }
    catch (error) {
        console.error("InterviewController evaluateAnswer error:", error);
        res.status(500).json({ message: 'Error evaluating answer.' });
    }
});
exports.evaluateAnswer = evaluateAnswer;
const storeInterviewSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { questions, answers, feedbacks, overallFeedback } = req.body;
        const processedFeedbacks = feedbacks.map((fb) => {
            if (typeof fb === 'string') {
                const scoreMatch = fb.match(/Score:\s*(\d+)/i);
                return {
                    text: fb,
                    score: scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1], 10) : undefined
                };
            }
            else if (fb && typeof fb === 'object') {
                let score = undefined;
                if (typeof fb.score === 'number') {
                    score = fb.score;
                }
                else if (fb.score && typeof fb.score === 'string') {
                    score = parseInt(fb.score, 10);
                }
                else if (fb.text && typeof fb.text === 'string') {
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
            .map((fb) => fb.score)
            .filter((score) => typeof score === 'number' && !isNaN(score));
        const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const interviewData = {
            userId: user.id,
            questions,
            answers,
            feedbacks: processedFeedbacks,
            overallFeedback,
            overallScore
        };
        const interview = new Interview_1.default(interviewData);
        yield interview.save();
        res.status(201).json({ message: 'Interview session saved successfully.', interview });
    }
    catch (error) {
        console.error("Error storing interview session:", error);
        res.status(500).json({ message: 'Error storing interview session.' });
    }
});
exports.storeInterviewSession = storeInterviewSession;
