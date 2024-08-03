import { getDb } from "../utils/database/connectionTomongo";
import { Request, Response } from "express";
import userSchema from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function registerUser(req: Request, res: Response) {
  try {
    const db = await getDb();
    const usersCollection = db.collection("users");
    const parsed = userSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    await usersCollection.insertOne({
      username: parsed.username,
      password: hashedPassword,
    });

    res.status(201).send("User registered");
  } catch (err) {
    console.error("Failed to execute query", err);
    res.status(500).send("Error executing query");
  }
}
export async function loginUser(req: Request, res: Response) {
  try {
    const db = await getDb();
    const usersCollection = db.collection("users");
    const parsed = userSchema.parse(req.body);
    const { username, password } = parsed;

    const user = await usersCollection.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Failed to execute query", err);
    res.status(500).send("Error executing query");
  }
}
