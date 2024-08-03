import { MongoClient, Db } from "mongodb";
import { areEnvVariablesAvailable } from "../configCheck";
if (!areEnvVariablesAvailable("MONGO_URI", "MONGO_DB_NAME")) {
  process.exit(1);
}
const url = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(url as string, {});
let db: Db | undefined;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const getDb = async () => {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
};

export const closeConnection = async () => {
  await client.close();
};
