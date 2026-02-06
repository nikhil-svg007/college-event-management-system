import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 5000,
  MONGO_URI = 'mongodb://localhost:27017/college_event_management',
  JWT_SECRET = 'change_this_jwt_secret_in_env',
  NODE_ENV = 'development',
  GEMINI_API_KEY
} = process.env;

