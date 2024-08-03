import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
export interface UserRequest extends Request {
	user?: JwtPayload | string;
}
