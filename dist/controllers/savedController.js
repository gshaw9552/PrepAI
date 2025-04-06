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
exports.updateSavedQuestion = exports.getSavedQuestions = exports.saveQuestion = void 0;
const SavedQuestion_1 = __importDefault(require("../models/SavedQuestion"));
// Save a question for a user (store the full question text as provided)
const saveQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { question, answer } = req.body;
        if (!question) {
            res.status(400).json({ message: "Question is required." });
            return;
        }
        const saved = new SavedQuestion_1.default({
            userId: user.id,
            question, // Save the full question text
            answer,
        });
        yield saved.save();
        res.status(201).json({ message: "Question saved successfully.", saved });
    }
    catch (error) {
        next(error);
    }
});
exports.saveQuestion = saveQuestion;
// Get saved questions for the logged-in user
const getSavedQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const saved = yield SavedQuestion_1.default.find({ userId: user.id }).sort({ createdAt: -1 });
        res.json({ saved });
    }
    catch (error) {
        next(error);
    }
});
exports.getSavedQuestions = getSavedQuestions;
// Update an answer (and optionally feedback) for a saved question
const updateSavedQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id } = req.params;
        const { answer, feedback } = req.body;
        const updated = yield SavedQuestion_1.default.findOneAndUpdate({ _id: id, userId: user.id }, { answer, feedback }, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Saved question not found." });
            return;
        }
        res.json({ message: "Saved question updated.", saved: updated });
    }
    catch (error) {
        next(error);
    }
});
exports.updateSavedQuestion = updateSavedQuestion;
