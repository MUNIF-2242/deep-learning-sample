import { connectToDatabase } from "@/mongodbMiddleware";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({
  region: process.env.REGION_AWS,
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
          max_tokens: 100,
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
                  text: `You are a helpful assistant who uses only the provided knowledge base context to answer questions. If the answer is not in the context, say you don't know.\n\nUse the following context to answer the question:\n\nContext:\n${contextText}\n\nQuestion: ${query}`,
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
