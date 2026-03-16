const { GoogleGenerativeAI } = require("@google/generative-ai")
const puppeteer = require("puppeteer")

const getModel = (modelName) => {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey || apiKey.length < 10) {
        throw new Error("VISH-AI-ERROR: GOOGLE_GENAI_API_KEY is missing or invalid in Render environment.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // THE 404 FIX: 
    // - 1.5 models (Flash) perform best on 'v1beta'
    // - 1.0/Pro models are stable on 'v1'
    const useBeta = modelName.includes("1.5");
    const apiVersion = useBeta ? "v1beta" : "v1";

    console.log(`VISH-AI-STRATEGY: Using ${modelName} on API version ${apiVersion}`);
    
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

    // Only trying stable, proven model names on the V1 endpoint
    const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`VISH-AI-TRY: Attempting ${modelName}...`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(responseText);
            console.log(`VISH-AI-SUCCESS: Response received from ${modelName}`);
            return parsed;
        } catch (error) {
            console.error(`VISH-AI-FAIL: ${modelName} turned back error:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("AI service could not connect. Please check your Render environment variables.");
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
    const prompt = `Generate a professional resume in HTML. Resume: ${resume} Job: ${jobDescription}. Return ONLY JSON: {"html": "..."}`

    const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`VISH-AI-TRY-PDF: Attempting ${modelName}...`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            const jsonContent = JSON.parse(responseText);
            const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
            return pdfBuffer;
        } catch (error) {
            console.error(`VISH-AI-FAIL-PDF: ${modelName} error:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("PDF Generation Failed.");
}

module.exports = { generateInterviewReport, generateResumePdf }