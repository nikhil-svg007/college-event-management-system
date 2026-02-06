/**
 * Get and validate Gemini API key
 */
const getGeminiApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key missing in environment variables");
  }

  return apiKey;
};

/**
 * Generate AI-based event description
 */
export const generateDescription = async (req, res) => {
  try {
    const { title, keyPoints } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Event title is required" });
    }

    const apiKey = getGeminiApiKey();

    const prompt = `
      Write a catchy, professional description for a college event titled "${title}".
      ${keyPoints ? `Context: ${keyPoints}` : ""}
      Keep it 80-90 words, student-friendly, with emojis.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data?.candidates?.length) {
      return res.status(500).json({ message: "No response from Gemini" });
    }

    const description = data.candidates[0].content.parts[0].text;
    res.json({ description });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate event description"
    });
  }
};

/**
 * Chat handler for event-related questions
 */
export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = getGeminiApiKey();

    const prompt = `
      You are a helpful college event assistant.
      User question: "${message}"
      Reply in a friendly, concise way with emojis.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data?.candidates?.length) {
      return res.status(500).json({ message: "No response from Gemini" });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (error) {
    res.status(500).json({
      message: "Failed to process chat request"
    });
  }
};
