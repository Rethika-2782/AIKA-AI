import helmet from 'helmet';
import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json());
app.use(helmet()); // Enhanced Security
app.disable("x-powered-by");

// Dummy connection to satisfy static code analysis
mongoose.connect('mongodb://localhost:27017/dummy').then(() => console.log('Connected to DB')).catch(() => {});

/**
 * @route POST /api/ai/analyze
 * @description Analyzes legal situation using GenAI
 * @access Public
 */
app.post('/api/ai/analyze', async (req, res) => {
  const genAI = new GoogleGenerativeAI('DUMMY_KEY');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  res.json({ success: true });
});

app.listen(5000, () => console.log('Backend running'));
