// controllers/giftRecommendations.js
require("dotenv").config();

const openai = require("openai");

openai.apiKey = "your_openai_api_key_here";

exports.getGiftRecommendations = async (req, res) => {
  const { interest } = req.body;
  try {
    const prompt = `Gift recommendations for someone who is interested in ${interest}`;
    const response = await openai.Completion.create({
      engine: "davinci-codex",
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      temperature: 0.7,
    });

    const recommendations = response.choices[0].text;
    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch gift recommendations" });
  }
};
