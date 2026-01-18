import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_DASHBOARD_GEMINI_API_KEY
const geminiAI = new GoogleGenAI({apiKey: API_KEY});

export default geminiAI;