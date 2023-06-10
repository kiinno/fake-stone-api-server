import type { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { SuperRequest } from '../middlewares/guard';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse';

/**
 * Authenticate a user with username and password if Authentication data is valid will be get the token else will be get an error response
 * @body [Username*, Password*]
 * @param req
 * @param res
 * @param next
 * @return Login Controller
 */
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

/**
 * Response user document if authenticated else will be get error response
 * @param req
 * @param res
 * @param next
 */
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
