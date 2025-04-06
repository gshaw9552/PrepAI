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
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
// Zod schema for registration: now expects username, email, and password (with confirmPassword for validation)
const registerSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(1, { message: 'Username is required' }),
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
    password: zod_1.z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: zod_1.z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
// Registration endpoint
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = registerSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
            return;
        }
        const { username, email, password } = parsedData.data;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists.' });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = new User_1.default({ username, email, password: hashedPassword });
        yield user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
// Zod schema for login: now uses an identifier field (email or username)
const loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1, { message: 'Email or Username is required' }),
    password: zod_1.z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
// Login endpoint: finds a user by either email or username
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
            return;
        }
        const { identifier, password } = parsedData.data;
        // Search for a user whose email or username matches the identifier
        const user = yield User_1.default.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
