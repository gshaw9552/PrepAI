// src/index.ts 
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import interviewRoutes from './routes/interviewRoutes';
import savedRoutes from './routes/savedRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get("/", (req,res)=>{
  res.json("hello from backend!!!!!!!!!")
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
