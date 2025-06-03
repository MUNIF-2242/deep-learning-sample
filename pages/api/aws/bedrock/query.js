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
    // console.log("Received query:", query);

    // Generate query embedding
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
            limit: 1,
          },
        },
      ])
      .toArray();

    //console.log("Query results:", results);

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error in query handler:", error);
    return res.status(500).json({
      message: "An error occurred while querying documents.",
      error: error.message,
    });
  }
}
