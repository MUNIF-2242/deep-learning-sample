import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { MongoClient } from "mongodb";

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

    console.log("Received query:", query);

    // 1️⃣ Generate query embedding
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

    // 2️⃣ Search MongoDB Vector Store
    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db("knowledgebase");
    const collection = db.collection("documents");

    const results = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 10,
            limit: 5,
          },
        },
      ])
      .toArray();

    await mongoClient.close();

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error in query handler:", error);
    res.status(500).json({
      message: "An error occurred while querying documents.",
      error: error.message,
    });
  }
}
