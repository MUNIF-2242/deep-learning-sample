import {
  BedrockClient,
  CreateKnowledgeBaseCommand,
} from "@aws-sdk/client-bedrock";

const bedrock = new BedrockClient({
  region: process.env.REGION_AWS,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const params = {
      name: "single-company-kb",
      roleArn: process.env.AWS_ROLE_ARN,
      knowledgeBaseConfiguration: {
        type: "VECTOR",
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn:
            "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1",
          vectorStoreConfiguration: {
            mongoDbAtlas: {
              connectionUri: process.env.MONGODB_URI,
              databaseName: "knowledge_base",
              collectionName: "documents",
              fieldMapping: {
                textField: "content",
                metadataField: "metadata",
                vectorField: "embedding",
              },
            },
          },
        },
      },
      dataSourceConfiguration: {
        s3: {
          bucketArn: process.env.AWS_S3_BUCKET_ARN,
          // optional: remove or use a single prefix if needed
          inclusionPrefixes: ["company/"],
        },
      },
    };

    const command = new CreateKnowledgeBaseCommand(params);
    const response = await bedrock.send(command);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error creating knowledge base:", error);
    res.status(500).json({ error: error.message });
  }
}
