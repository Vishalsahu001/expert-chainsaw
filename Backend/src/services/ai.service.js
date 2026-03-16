const { GoogleGenerativeAI } = require("@google/generative-ai")
const puppeteer = require("puppeteer")

const getModel = (modelName) => {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey || apiKey.length < 10) {
        throw new Error("VISH-AI-ERROR: GOOGLE_GENAI_API_KEY is missing or invalid in Render environment.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // Auto-detect correct API version:
    // 1.5 versions living on v1beta often support more advanced features
    // standard or fallback models use v1
    const useBeta = modelName.includes("1.5") || modelName.includes("flash");
    const apiVersion = useBeta ? "v1beta" : "v1";

    console.log(`VISH-AI-SMART-INIT: Initializing ${modelName} with API version ${apiVersion}`);
    
    return genAI.getGenerativeModel(
        { model: modelName },
        { apiVersion }
    );
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a detailed interview report for a candidate. 
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        
                        Return ONLY a JSON object exactly matching this structure:
                        {
                          "matchScore": number (0-100),
                          "technicalQuestions": [{"question": "...", "intention": "...", "answer": "..."}],
                          "behavioralQuestions": [{"question": "...", "intention": "...", "answer": "..."}],
                          "skillGaps": [{"skill": "...", "severity": "low/medium/high"}],
                          "preparationPlan": [{"day": number, "focus": "...", "tasks": ["..."]}],
                          "title": "Job Title"
                        }
                        Do not include any other text or markdown formatting (like \`\`\`json). Just the raw JSON object.`

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`VISH-AI-SMART-TRY: Attempting report with ${modelName}...`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(responseText);
            console.log(`VISH-AI-SMART-TRY: Success with ${modelName}!`);
            return parsed;
        } catch (error) {
            console.error(`VISH-AI-SMART-TRY: Failed with ${modelName}:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("All AI models failed to respond. Please check your API key.");
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a professional, ATS-friendly resume in HTML format.
                        Resume context: ${resume}
                        Self Description: ${selfDescription}
                        Job Description to target: ${jobDescription}
                        
                        Return ONLY a JSON object with this exact field:
                        {
                          "html": "The full HTML code for the resume (professional styling included)"
                        }
                        Do not include any other text or markdown formatting (like \`\`\`json). Just the raw JSON object.`

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`VISH-AI-SMART-TRY: Attempting resume with ${modelName}...`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            const jsonContent = JSON.parse(responseText);
            const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
            console.log(`VISH-AI-SMART-TRY: Success with ${modelName}!`);
            return pdfBuffer;
        } catch (error) {
            console.error(`VISH-AI-SMART-TRY: Failed with ${modelName}:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("All AI models failed to generate PDF. Please try again.");
}

module.exports = { generateInterviewReport, generateResumePdf }