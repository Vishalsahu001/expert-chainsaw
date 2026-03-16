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
        version: "VISH-AI-V6-STABILITY",
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    })
})

// New Debug Route to see exactly what models Google allows for your key
app.get("/api/debug-models", async (req, res) => {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
        // We'll try to list models to see what the actual names/versions are
        res.json({ 
            message: "Check server logs for full model list",
            hint: "If this fails, the API key is likely the issue."
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
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