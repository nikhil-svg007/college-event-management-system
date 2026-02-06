import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

async function testRest() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    console.log(`Testing URL: https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=MASKED`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Hello" }]
                }]
            })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        if (response.ok) {
            console.log("Success! Response:", JSON.stringify(data).substring(0, 100) + "...");
        } else {
            console.log("Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testRest();
