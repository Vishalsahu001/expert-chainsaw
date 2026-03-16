const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    try {
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey) {
            console.error("No API key found in .env");
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const result = await genAI.listModels();
        console.log("AVAILABLE_MODELS_START");
        console.log(JSON.stringify(result.models, null, 2));
        console.log("AVAILABLE_MODELS_END");
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
