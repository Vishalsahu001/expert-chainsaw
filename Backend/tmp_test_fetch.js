const fs = require("fs");
require("dotenv").config();

async function testDirectFetch() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        console.error("No API key");
        return;
    }

    const payload = {
        contents: [{ parts: [{ text: "Say hello" }] }]
    };

    const urls = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`
    ];

    for (const url of urls) {
        try {
            console.log(`TESTING: ${url.split('?')[0]}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`SUCCESS: ${url.split('?')[0]}`);
                console.log("RESPONSE:", JSON.stringify(data, null, 2).substring(0, 500));
                return;
            } else {
                console.error(`FAILED: ${url.split('?')[0]} - Status: ${response.status} - Message: ${data.error?.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error(`ERROR: ${url.split('?')[0]} - ${error.message}`);
        }
    }
}

testDirectFetch();
