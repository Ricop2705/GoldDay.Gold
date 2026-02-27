import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

export default async function getClient() {

  if (!uri) {
    console.error("❌ MONGODB_URI tidak ditemukan");
    throw new Error("Database not configured");
  }

  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}