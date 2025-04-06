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
exports.getAnalytics = void 0;
const Interview_1 = __importDefault(require("../models/Interview"));
const SavedQuestion_1 = __importDefault(require("../models/SavedQuestion"));
const getAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // Fetch interview sessions for the user
        const interviews = yield Interview_1.default.find({ userId });
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
                if (interview.overallScore > highestScore)
                    highestScore = interview.overallScore;
            }
        });
        // Format scores for display - ensure they're not 'N/A' if valid scores exist
        const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount).toString() : 'N/A';
        const highestScoreDisplay = highestScore > 0 ? Math.round(highestScore).toString() : 'N/A';
        // Count saved questions from the SavedQuestion collection
        const savedQuestionsCount = yield SavedQuestion_1.default.countDocuments({ userId });
        const analytics = {
            completedInterviews,
            averageScore,
            highestScore: highestScoreDisplay,
            savedQuestions: savedQuestionsCount,
            interviews
        };
        res.json(analytics);
    }
    catch (error) {
        next(error);
    }
});
exports.getAnalytics = getAnalytics;
