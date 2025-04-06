"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts 
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const savedRoutes_1 = __importDefault(require("./routes/savedRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/interview', interviewRoutes_1.default);
app.use('/api/saved', savedRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.get("/", (req, res) => {
    res.json("hello from backend!!!!!!!!!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
