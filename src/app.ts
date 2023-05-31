import express, { json, urlencoded, Request, Response } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from 'dotenv';
import ApiRoute from './routes/index';
import morgan from 'morgan';
import { rejectBlockedIP } from './middlewares/guard';
import { Authenticate } from './middlewares/authentication';

const app = express();

config({
	path: './.env',
});

// Handle Development Mode Features
if (process.env.NODE_ENV === 'development') {
	console.log('Development Mode Running.');
	app.use(morgan('short'));
}

app.use(
	Authenticate,
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
	json({
		limit: '100kb',
	}),
	urlencoded({
		extended: true,
		limit: '100kb',
	})
);

app.use('/api', ApiRoute);
app.use('*', (_req: Request, res: Response) => {
	res.status(404).json({
		status: 'Not Found',
		message: '404 Page not found',
	});
});

app.use((err: unknown, _req: Request, res: Response) => {
	res.status(404).json({
		status: 'error',
		err,
	});
});

export default app;
