import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        // We can't list models directly with the high-level SDK easily in some versions?
        // Actually we can use the ModelService.
        // But for now, let's try a direct fetch if SDK doesn't expose it easily, or check if genAI.getGenerativeModel has a way.
        // Wait, the SDK has a model manager? No.

        // Let's try to verify with `gemini-1.5-flash-001` or `gemini-1.0-pro`.
        // But I want to list models.
        // The SDK doesn't always make it easy to list models without a client.
        // Let's try `gemini-1.5-flash-latest` or `gemini-pro` (again? maybe 1.0-pro).

        // Actually, let's just try 1.5-flash-8b or 1.5-pro.

        // Let's try a different approach: print the error details fully if possible.
        // But better: try a few known model names.

        const models = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-1.0-pro"];

        for (const m of models) {
            try {
                process.stdout.write(`Testing ${m}... `);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log("SUCCESS");
                return; // Found one!
            } catch (e) {
                console.log("FAILED");
            }
        }
        console.log("All tested models failed.");

    } catch (error) {
        console.error("Critical error:", error);
    }
}

listModels();
