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

    // console.log("Retrieved documents:", results);

    // Step 3: Build context for the Foundation Model
    const contextText = results
      .map((doc, index) => `Document ${index + 1}: ${doc.extractedText}`)
      .join("\n\n");

    // Step 4: Use Foundation Model (Claude) to generate an answer
    const prompt = `
\n\nSystem: You are a helpful assistant who uses only the provided knowledge base context to answer questions. If the answer is not in the context, say you don't know.

\n\nHuman: Use the following context to answer the question:

Context:
${contextText}

Question: ${query}

Assistant:`;

    const generationResponse = await bedrock.send(
      new InvokeModelCommand({
        modelId: "anthropic.claude-v2",
        body: JSON.stringify({
          prompt: prompt,
          max_tokens_to_sample: 10,
          temperature: 0.7,
        }),
        accept: "application/json",
        contentType: "application/json",
      })
    );

    const generationOutput = JSON.parse(
      Buffer.from(generationResponse.body).toString("utf-8")
    );

    const answer = generationOutput.completion;

    const messages = [
      { role: "user", content: query },
      { role: "assistant", content: answer },
    ];

    //console.log("Generated answer:", messages);

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in query handler:", error);
    return res.status(500).json({
      message: "An error occurred while generating the answer.",
      error: error.message,
    });
  }
}
