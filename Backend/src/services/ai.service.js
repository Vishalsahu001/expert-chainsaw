const { GoogleGenerativeAI } = require("@google/generative-ai")
const puppeteer = require("puppeteer")

const getModel = () => {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey || apiKey.length < 10) {
        throw new Error("VISH-AI-ERROR: GOOGLE_GENAI_API_KEY is missing or invalid in Render environment.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // Applying your suggested fixes:
    // 1. Using 'v1beta' as it's the working endpoint for 1.5-flash
    // 2. Using 'gemini-1.5-flash-latest' for the specific version
    return genAI.getGenerativeModel(
        { model: "gemini-1.5-flash-latest" },
        { apiVersion: "v1beta" }
    );
};

// ... keep interviewReportSchema for documentation/reference or helper ...

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

    const model = getModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Failed to parse AI response as JSON:", responseText);
        throw new Error("AI generated an invalid report format. Please try again.");
    }
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

    const model = getModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const jsonContent = JSON.parse(responseText);
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
        return pdfBuffer;
    } catch (error) {
        console.error("Failed to parse AI resume response:", responseText);
        throw new Error("AI generated an invalid resume format. Please try again.");
    }
}

module.exports = { generateInterviewReport, generateResumePdf }