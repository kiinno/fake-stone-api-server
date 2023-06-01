import type { Request, Response } from 'express';
import User from '../models/user';
import { SuperRequest } from '../middlewares/guard';

export async function login(req: Request, res: Response) {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (user && (await user.verifyPassword(password))) {
		res.status(200).json({
			status: 'success',
			token: user.generateToken(),
		});
	} else {
		res.status(403).json({
			status: 'failed',
			message: 'invalid username or password',
		});
	}
}

export function verifyToken(req: SuperRequest, res: Response) {
	if (req.auth?.isAuthenticated) {
		res.status(200).json({
			status: 'success',
			user: req.auth.user,
			token: req.auth.token,
		});
	} else {
		res.status(400).json({
			status: 'failed',
			message: 'Invalid Authentication',
		});
	}
}
