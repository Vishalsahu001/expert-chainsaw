const { GoogleGenerativeAI } = require("@google/generative-ai")
const puppeteer = require("puppeteer")

const getModel = (modelName) => {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey || apiKey.length < 10) {
        throw new Error("VISH-AI-ERROR: GOOGLE_GENAI_API_KEY is missing or invalid in Render environment.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // THE ULTIMATE 404 FIX:
    // Using v1beta for next-gen models (2.5, 2.0, 3.0) as verified in diagnostics.
    console.log(`VISH-AI-NEXT-GEN: Initializing ${modelName} on v1beta`);
    
    return genAI.getGenerativeModel(
        { model: modelName },
        { apiVersion: "v1beta" }
    );
};

const validateAndRepairReport = (report) => {
    const repairItem = (item, type) => ({
        question: item.question || `Missing ${type} question`,
        intention: item.intention || "Not provided by AI",
        answer: item.answer || "No specific answer provided by AI. Please prepare based on the question intention."
    });

    if (Array.isArray(report.technicalQuestions)) {
        report.technicalQuestions = report.technicalQuestions.map(q => repairItem(q, "technical"));
    }
    if (Array.isArray(report.behavioralQuestions)) {
        report.behavioralQuestions = report.behavioralQuestions.map(q => repairItem(q, "behavioral"));
    }
    
    // Ensure title exists
    if (!report.title) report.title = "Interview Preparation Report";
    if (!report.matchScore) report.matchScore = 50;

    return report;
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a detailed interview report for a candidate. 
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        
                        Return ONLY a JSON object exactly matching this structure. 
                        CRITICAL: Every question MUST have a "question", "intention", and "answer" field. DO NOT OMIT THE ANSWER.
                        
                        {
                          "matchScore": number (0-100),
                          "technicalQuestions": [{"question": "...", "intention": "...", "answer": "..."}],
                          "behavioralQuestions": [{"question": "...", "intention": "...", "answer": "..."}],
                          "skillGaps": [{"skill": "...", "severity": "low/medium/high"}],
                          "preparationPlan": [{"day": number, "focus": "...", "tasks": ["..."]}],
                          "title": "Job Title"
                        }
                        Do not include any other text or markdown formatting (like \`\`\`json). Just the raw JSON object.`

    // Optimized Priority: 2.0 is often faster than 2.5/3.0
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-3-flash-preview"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`VISH-AI-TRY: Attempting next-gen ${modelName} with validation...`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            let parsed = JSON.parse(responseText);
            
            // Validation & Repair Layer
            parsed = validateAndRepairReport(parsed);
            
            console.log(`VISH-AI-SUCCESS: Validated report received from ${modelName}`);
            return parsed;
        } catch (error) {
            console.error(`VISH-AI-FAIL: ${modelName} error:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("Next-Gen AI models failed to respond. Please check your Render logs.");
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

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3-flash-preview"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`VISH-AI-TRY-PDF: Attempting next-gen ${modelName}...`);
            const model = getModel(modelName);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            const jsonContent = JSON.parse(responseText);
            const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
            console.log(`VISH-AI-SUCCESS-PDF: Generated using ${modelName}`);
            return pdfBuffer;
        } catch (error) {
            console.error(`VISH-AI-FAIL-PDF: ${modelName} error:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("Next-Gen PDF Generation Failed.");
}

module.exports = { generateInterviewReport, generateResumePdf }