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
exports.AIService = void 0;
// src/services/AIService.ts
const axios_1 = __importDefault(require("axios"));
exports.AIService = {
    generateInterviewQuestion: (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt }) {
        var _b, _c, _d, _e, _f, _g, _h;
        try {
            const response = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Gemini response (question):", response.data);
            // Modified extraction: look in candidates[0].content.parts[0].text
            const question = (_h = (_g = (_f = (_e = (_d = (_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.candidates) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.parts) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) === null || _h === void 0 ? void 0 : _h.trim();
            if (!question)
                throw new Error("No generated text in response.");
            return question;
        }
        catch (error) {
            console.error('Error generating interview question:', error);
            throw new Error('Failed to generate interview question.');
        }
    }),
    evaluateAnswer: (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt }) {
        var _b, _c, _d, _e, _f, _g, _h;
        try {
            const response = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Gemini response (evaluation):", response.data);
            // Modified extraction for evaluation feedback:
            const feedback = (_h = (_g = (_f = (_e = (_d = (_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.candidates) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.parts) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) === null || _h === void 0 ? void 0 : _h.trim();
            if (!feedback)
                throw new Error("No feedback text in response.");
            return feedback;
        }
        catch (error) {
            console.error('Error evaluating answer:', error);
            throw new Error('Failed to evaluate answer.');
        }
    }),
};
