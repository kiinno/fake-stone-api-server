import type { Request, Response, NextFunction } from 'express';
import BlockedIP, { IBlockedIP } from '../models/blockedIp';
import { Types } from 'mongoose';
import { verify } from 'jsonwebtoken';
import User, { IUSER } from '../models/user';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse';
import APIKey from '../models/apiKey';

export interface FieldOptions {
	fieldName: string;
	width?: number;
	height?: number;
	dest: string;
	multiple?: boolean;
}

export interface SuperRequest extends Request {
	auth?: {
		isAuthenticated: boolean;
		token?: string;
		user?: IUSER;
	};
	sharps?: {
		ready?: boolean;
		sharps?: { file: FieldOptions; buffer: any; path: string }[];
	};
}
/**
 * Check if the user ip is not blocked if not blocked will continue middleware stack else sending an error
 */
export const rejectBlockedIP = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
	const blockedIP: IBlockedIP | null = await BlockedIP.findOne({
		ip: req.socket.remoteAddress,
	});
	const dt = new Date(new Date().toUTCString());
	if (blockedIP) {
		const msg = `Sorry, Your IP '${blockedIP.ip}' has been banned`;
		if (blockedIP.to) {
			const bannedTo = new Date(blockedIP.to);
			const unlockedIn = `${bannedTo.toUTCString()}`;
			if (dt < bannedTo) {
				return next(new ErrorResponse(`${msg}, Unlocked in ${unlockedIn}`, 401));
			}
		} else {
			return next(new ErrorResponse(msg, 401));
		}
	}
	return next();
});

/**
 * Check user token is valid to continue as authenticated user and create req.auth object else will be send an error message
 */
export const authenticate = asyncHandler(async (req: SuperRequest, _res: Response, next: NextFunction) => {
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
});

/**
 * Return middle to check the user authorization
 * @param su
 * @returns Express Middleware
 */
export const isSuperUser = (su: 0 | 1 | 2) =>
	asyncHandler(async (req: SuperRequest, _res: Response, next: NextFunction) => {
		if (req.auth?.isAuthenticated) {
			if (req.auth.user?.super === su) {
				return next();
			}
		}
		next(new ErrorResponse('Unauthorized or you dont have permissions to access this page.', 403));
	});

/**
 * Check And Validate The API Key Is valid and not expired if rejected will be send an error message
 */
export const checkAPIKey = asyncHandler(async (req: SuperRequest, _res: Response, next: NextFunction) => {
	const key = req.get('X-API-KEY');
	if (key) {
		const apiKey = await APIKey.findOne({ key });
		if (apiKey) {
			const dt = new Date();
			if (apiKey?.expiredAt && dt < apiKey?.expiredAt && !apiKey.blocked) {
				return next();
			} else if (apiKey.blocked) {
				next(new ErrorResponse("Sorry, Your API Key has been blocked you can't use it", 401));
			}
		}
	}

	next(new ErrorResponse('Invalid or not found your api key', 401));
});
