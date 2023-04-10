// controllers/giftRecommendations.js
require("dotenv").config();

const { OpenAIApi, Configuration } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(config);

const giftRecommendations = async (req, res) => {
  const { interests } = req.body;
  console.log(interests);

  if (!interests || interests.length === 0) {
    res.status(400).json({ error: "No interests provided" });
    return;
  }

  try {
    const prompt = `Create a list of 3 gift recommendations for someone who is interested in ${interests}. Each recommendation should include a title, a description, and a target_money value. The target_money should be approximately £50, £100, and £200 for the three recommendations, respectively. Format each recommendation as a JSON object and separate each object with a newline. Example:

{
  "title": "Gift 1",
  "description": "Gift 1 description",
  "target_money": 50
}
{
  "title": "Gift 2",
  "description": "Gift 2 description",
  "target_money": 100
}
{
  "title": "Gift 3",
  "description": "Gift 3 description",
  "target_money": 200
}`;

    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      n: 1,
      temperature: 0.5,
    });

    console.log("OpenAI API response data:", data);
    console.log(data.choices[0].message.content);

    const recommendationsString = data.choices[0].message.content;
    const jsonString =
      "[" + recommendationsString.replace(/\}\s*\{/g, "},{") + "]";
    const recommendationsArray = JSON.parse(jsonString);

    res.json(recommendationsArray);
  } catch (error) {
    console.error("Error in giftRecommendations:", error);
    if (error.response) {
      console.error("Error response from OpenAI API:", error.response.data);
    }
    res.status(500).json({
      error: "Failed to fetch gift recommendations",
      details: error.message,
    });
  }
};

module.exports = {
  giftRecommendations,
};
