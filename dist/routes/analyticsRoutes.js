"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/analyticsRoutes.ts
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.protect, analyticsController_1.getAnalytics);
exports.default = router;
