const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PALM_READING_PROMPT = `As an expert palm reader, analyze this palm image and provide a detailed reading in the following JSON format:
{
  "handAnalysis": "...",
  "majorLines": "...",
  "lifePath": "...",
  "personalityTraits": "...",
  "futureInsights": "..."
}
Ensure each section is a single string with proper formatting and line breaks. Do not use nested objects.`;

app.post('/analyze', async (req, res) => {
  try {
    const { base64Image } = req.body;
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: PALM_READING_PROMPT },
            { type: "input_image", image_url: `data:image/jpeg;base64,${base64Image}` }
          ]
        }
      ]
    });
    res.json({ result: response.output_text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
}); 