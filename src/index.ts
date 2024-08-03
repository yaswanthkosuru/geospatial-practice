import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { connectToDatabase } from "./utils/database/connectionTomongo";

const app = express();
const port = process.env.PORT || 3000;

connectToDatabase();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
