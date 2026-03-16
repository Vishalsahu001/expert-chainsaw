const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.set('trust proxy', 1)

app.use(express.json())
app.use(cookieParser())
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "http://localhost:5173"

app.use(cors({
    origin: frontendUrl,
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Health Check with Version Tracking
app.get("/api/health", (req, res) => {
    res.json({
        status: "alive",
        version: "VISH-AI-V9-VALIDATION-FIX",
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    })
})

// New Debug Route to see exactly what models Google allows for your key
app.get("/api/debug-models", async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
        
        // Use the v1 API to list models
        const models = await genAI.getGenerativeModel({ model: "gemini-pro" }, { apiVersion: "v1" }).listModels();
        
        res.json({ 
            availableModels: models.models.map(m => ({
                name: m.name,
                version: m.version,
                displayName: m.displayName,
                supportedMethods: m.supportedGenerationMethods
            }))
        });
    } catch (err) {
        console.error("DEBUG-MODELS-ERROR:", err);
        res.status(500).json({ 
            error: err.message,
            stack: err.stack,
            hint: "This usually means the API key is restricted or the method listModels is not in this SDK version."
        });
    }
})

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {}
    })
})



module.exports = app