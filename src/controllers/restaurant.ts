import { getDb } from "../utils/database/connectionTomongo";
import { Request, Response } from "express";
export async function getRestaurants(req: Request, res: Response) {
  try {
    console.log("getRestaurants called");
    const db = await getDb();
    const collection = db.collection("restaurants");
    const documents = await collection.find({}).limit(10).toArray();
    res.json(documents);
  } catch (err) {
    console.error("Failed to execute query", err);
    res.status(500).send("Error executing query");
  }
}
