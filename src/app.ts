import express, { json, urlencoded, Request, Response, NextFunction, static as reservStatics } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from 'dotenv';
import ApiRoute from './routes/index';
import morgan from 'morgan';
import { rejectBlockedIP } from './middlewares/guard';
import ErrorResponse from './utils/errorResponse';
import globalError from './middlewares/globalError';
import { join } from 'path';

const app = express();

config({
	path: './.env',
});

// Handle Development Mode Features
if (process.env.NODE_ENV === 'development') {
	console.log('Development Mode Running.');
	app.use(morgan('short'));
}

// serve static files
const { IMAGES_PATH, IMAGES_ROUTE = '/image' } = process.env;
if (IMAGES_PATH) {
	app.use(IMAGES_ROUTE, reservStatics(join(__dirname, IMAGES_PATH)));
}

app.use(
	cors({
		methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
		origin: '*',
	}),
	rateLimit({
		windowMs: 60 * 60 * 1000, // 1 hour
		max: 100, // Limit each IP to 5 create account requests per `window` (here, per hour)
		message: {
			error: {
				name: 'TooManyRequestsError',
				message: 'Too many requests, please try again later :(',
			},
		},
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	}),
	rejectBlockedIP,
	// checkAPIKey,
	json({
		limit: '100kb',
	}),
	urlencoded({
		extended: true,
		limit: '100kb',
	})
);

app.use('/api', ApiRoute);

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
	next(new ErrorResponse('Page not found', 404));
});

app.use(globalError);

export default app;
