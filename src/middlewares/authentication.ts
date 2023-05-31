import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { verify } from 'jsonwebtoken';
import User, { IUSER } from '../models/user';

export interface SuperRequest extends Request {
	auth?: {
		isAuthenticated: boolean;
		token?: string;
		user?: IUSER;
	};
}

export async function Authenticate(req: SuperRequest, _res: Response, next: NextFunction) {
	try {
		let token = req.get('Authentication');
		const { JWT_SECRET_KEY = '' } = process.env;
		req.auth = {
			isAuthenticated: false,
		};

		if (token) {
			if (token.startsWith('Bearer ')) token = token.split(' ').pop() ?? '';
			const payload = verify(token, JWT_SECRET_KEY);
			const user = await User.findById((payload as { id: Types.ObjectId }).id);
			if (user) {
				req.auth = {
					isAuthenticated: true,
					token,
					user,
				};
			}
		}
		next();
	} catch (error) {
		next();
	}
}
