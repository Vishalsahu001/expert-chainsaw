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

app.get("/api/debug-env", (req, res) => {
    res.json({
        has_gemini_key: !!process.env.GOOGLE_GENAI_API_KEY,
        key_length: process.env.GOOGLE_GENAI_API_KEY ? process.env.GOOGLE_GENAI_API_KEY.length : 0,
        node_env: process.env.NODE_ENV,
        mongo_status: mongoose.connection.readyState
    })
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