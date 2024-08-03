import { getDb } from '../utils/database/connectionTomongo';
import { Request, Response } from 'express';
import userSchema from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function registerUser(req: Request, res: Response) {
	try {
		const db = await getDb();
		const usersCollection = db.collection('users');
		const parsed = userSchema.parse(req.body);
		const hashedPassword = await bcrypt.hash(parsed.password, 10);

		const user = await usersCollection.findOne({ username: parsed.username });
		if (user) {
			return res.status(400).json({ errors: `User ${user.username} already exists` });
		}

		await usersCollection.insertOne({
			username: parsed.username,
			password: hashedPassword,
		});
		res.status(201).send('User registered');
	} catch (err) {
		if (err instanceof z.ZodError) {
			const errorMessages = err.errors.map((error) => ({
				path: error.path.join('.'),
				message: error.message,
			}));
			return res.status(400).json({ errors: errorMessages });
		}
		res.status(500).send('unknown error occured');
	}
}
export async function loginUser(req: Request, res: Response) {
	try {
		const parsed = userSchema.parse(req.body);
		const db = await getDb();
		const usersCollection = db.collection('users');
		const { username, password } = parsed;
		const user = await usersCollection.findOne({ username });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).send('Invalid credentials');
		}
		const token = jwt.sign(user, JWT_SECRET_KEY as string, {
			expiresIn: '1h',
		});
		res.json({ token });
	} catch (err) {
		console.error(err);
		res.status(500).send('Error please provide valid credentials');
	}
}
