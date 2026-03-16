const fs = require("fs");
require("dotenv").config();

async function runExhaustiveTest() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        fs.writeFileSync("test_results.json", JSON.stringify({ error: "No API key" }));
        return;
    }

    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    const versions = ["v1", "v1beta"];
    const results = [];

    const payload = {
        contents: [{ parts: [{ text: "Short test: respond with 'OK'" }] }]
    };

    for (const version of versions) {
        for (const model of models) {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
            const testKey = `${version}/${model}`;
            console.log(`Testing ${testKey}...`);
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                results.push({
                    endpoint: testKey,
                    status: response.status,
                    ok: response.ok,
                    message: response.ok ? "SUCCESS" : (data.error?.message || "Unknown error")
                });
            } catch (err) {
                results.push({
                    endpoint: testKey,
                    status: "ERROR",
                    ok: false,
                    message: err.message
                });
            }
        }
    }

    fs.writeFileSync("test_results.json", JSON.stringify(results, null, 2));
    console.log("Done. Results written to test_results.json");
}

runExhaustiveTest();
