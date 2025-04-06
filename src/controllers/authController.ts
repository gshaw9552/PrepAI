// server/src/controllers/authController.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { IUser } from '../models/User';

// Zod schema for registration: now expects username, email, and password (with confirmPassword for validation)
const registerSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Registration endpoint
export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = registerSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
      return;
    }
    const { username, email, password } = parsedData.data;

    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    next(error);
  }
};

// Zod schema for login: now uses an identifier field (email or username)
const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'Email or Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Login endpoint: finds a user by either email or username
export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
      return;
    }
    const { identifier, password } = parsedData.data;

    // Search for a user whose email or username matches the identifier
    const user: IUser | null = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
