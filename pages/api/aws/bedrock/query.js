import { connectToDatabase } from "@/mongodbMiddleware";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({
  region: process.env.REGION_BEDROCK_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { query } = req.body;

    // Step 1: Embed query
    const embeddingResponse = await bedrock.send(
      new InvokeModelCommand({
        modelId: "amazon.titan-embed-text-v1",
        body: JSON.stringify({ inputText: query }),
        accept: "application/json",
        contentType: "application/json",
      })
    );

    const queryEmbedding = JSON.parse(
      Buffer.from(embeddingResponse.body).toString("utf-8")
    ).embedding;

    // Step 2: Retrieve relevant documents
    const { db } = await connectToDatabase();
    const collection = db.collection("documents");

    const results = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 10,
            limit: 3,
          },
        },
      ])
      .toArray();

    // Step 3: Build context from knowledge base
    const contextText = results
      .map((doc, index) => `Document ${index + 1}: ${doc.extractedText}`)
      .join("\n\n");

    // Step 4: Use Claude with messages format
    const generationResponse = await bedrock.send(
      new InvokeModelCommand({
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        accept: "application/json",
        contentType: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 500, // Increased token limit to reduce truncation risk
          temperature: 0.7,
          top_k: 250,
          top_p: 0.999,
          stop_sequences: [],
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
    You are a helpful assistant. Please follow these instructions carefully:
    
    1. First, check the provided context below. If you find the answer there, use that context to answer the question as thoroughly as possible.
    
    2. If you cannot find the answer in the context, please say: "I couldn't find the answer in the provided documents, but here is a concise answer based on my own knowledge." Then provide a short, helpful answer.
    
    3. Keep your answer under 50 words. However, always complete your answer fully—do not cut your answer short or truncate it, even if it approaches the token limit.
    
    Here is the context:
    ${contextText}
    
    Question:
    ${query}
                  `,
                },
              ],
            },
          ],
        }),
      })
    );

    const generationOutput = JSON.parse(
      Buffer.from(generationResponse.body).toString("utf-8")
    );

    // The response format may vary slightly (Claude 3 often uses 'content' instead of 'completion')
    const answer = generationOutput.content?.[0]?.text || "No answer found.";

    const messages = [
      { role: "user", content: query },
      { role: "assistant", content: answer },
    ];

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in query handler:", error);
    return res.status(500).json({
      message: "An error occurred while generating the answer.",
      error: error.message,
    });
  }
}
