import express from 'express';
import cors from 'cors';
import path from 'path';

import { PORT } from './config/env.js';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

//middlwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//multer
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
console.log("AI Service: Gemini AI Only");
console.log("Environment GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND");


//error handlers
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
