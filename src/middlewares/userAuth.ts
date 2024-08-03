import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRequest } from '../@types/customType';
const JWT_SECRET = process.env.JWT_SECRET_KEY;

export function authenticateToken(req: UserRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];

	const token = authHeader && authHeader.split(' ')[1]; // Get token from Bearer header

	if (token == null) return res.status(401).json({ error: 'Access denied' });

	jwt.verify(token, JWT_SECRET as string, (err, user) => {
		if (err) return res.status(403).json({ error: 'Invalid token' });
		req.user = user;
		next();
	});
}
