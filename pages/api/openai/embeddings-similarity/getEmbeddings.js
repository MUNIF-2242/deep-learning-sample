const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key here
});

const getEmbeddings = async (text, model = "text-embedding-ada-002") => {
  try {
    // Replace newlines with spaces
    const sanitizedText = text.replace(/\r?\n|\r/g, " ");

    const response = await openai.embeddings.create({
      model, // Specify the model for generating embeddings
      input: sanitizedText,
    });

    // Return the embedding vector
    return response.data[0].embedding;
  } catch (error) {
    throw new Error("Unable to fetch embeddings");
  }
};

module.exports = getEmbeddings;
