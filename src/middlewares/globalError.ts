import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

function sendErrorForDev(err: any, res: Response) {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
}

function sendErrorForProd(err: any, res: Response) {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
}

export default function (err: any, _req: Request, res: Response, _next: NextFunction) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (process.env.NODE_ENV === 'development') {
		sendErrorForDev(err, res);
	} else {
		if (err.name === 'JsonWebTokenError') err = new ErrorResponse('Invalid token, please login again..', 401);
		if (err.name === 'TokenExpiredError') err = new ErrorResponse('Expired token, please login again..', 401);
		sendErrorForProd(err, res);
	}
}
