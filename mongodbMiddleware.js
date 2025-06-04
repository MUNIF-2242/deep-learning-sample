// lib/mongodbMiddleware.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedClient;
let cachedDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  cachedClient = new MongoClient(uri, {
    maxPoolSize: 10, // for concurrent connections
    serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
  });

  await cachedClient.connect();
  cachedDb = cachedClient.db("knowledgebase");
  return { client: cachedClient, db: cachedDb };
}

/*
For atlas search json view

{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}

*/
