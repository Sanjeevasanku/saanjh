require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.0,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const userInput = "tell me about covid-19";
  const result = await chatSession.sendMessage(userInput);
  console.log(`User Input: ${userInput}`);
  console.log(`Bot Response: ${result.response.text()}`);
}

run().catch((err) => {
  console.error("Error running chat:", err);
});
