require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        console.error("No API key");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        console.log(`FETCHING: ${url.split('?')[0]}...`);
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            console.log("SUCCESS");
            require("fs").writeFileSync("models_list.json", JSON.stringify(data, null, 2));
            console.log("Full list written to models_list.json");
        } else {
            console.error(`FAILED: Status ${response.status} - Message: ${data.error?.message || "Unknown error"}`);
            require("fs").writeFileSync("models_error.json", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

listModels();
