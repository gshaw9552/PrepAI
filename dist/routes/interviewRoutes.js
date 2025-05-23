"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interviewController_1 = require("../controllers/interviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const interviewController_2 = require("../controllers/interviewController");
const router = (0, express_1.Router)();
router.post('/generate', authMiddleware_1.protect, interviewController_1.generateQuestion);
router.post('/evaluate', authMiddleware_1.protect, interviewController_1.evaluateAnswer);
router.post('/store', authMiddleware_1.protect, interviewController_2.storeInterviewSession);
exports.default = router;
