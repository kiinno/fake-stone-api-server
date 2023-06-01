import type { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { SuperRequest } from '../middlewares/guard';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse';

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (user && (await user.verifyPassword(password))) {
		res.status(200).json({
			status: 'success',
			token: user.generateToken(),
		});
	} else {
		next(new ErrorResponse('invalid username or password', 304));
	}
});

export function verifyToken(req: SuperRequest, res: Response, next: NextFunction) {
	if (req.auth?.isAuthenticated) {
		res.status(200).json({
			status: 'success',
			user: req.auth.user,
			token: req.auth.token,
		});
	} else {
		next(new ErrorResponse('Invalid Authentication', 400));
	}
}
