import express, { json, urlencoded, Request, Response, NextFunction, static as reservStatics } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from 'dotenv';
import ApiRoute from './routes/index';
import morgan from 'morgan';
import { rejectBlockedIP, checkAPIKey } from './middlewares/guard';
import ErrorResponse from './utils/errorResponse';
import globalError from './middlewares/globalError';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { join } from 'path';

const app = express();

config({
	path: './.env',
});

app.use(cors({ methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], origin: '*' }));

// serve static files
const { IMAGES_PATH, IMAGES_ROUTE = '/image' } = process.env;
if (IMAGES_PATH) {
	app.use(IMAGES_ROUTE, reservStatics(join(__dirname, IMAGES_PATH)));
}

app.use(json({ limit: '20kb' }), urlencoded({ extended: true, limit: '20kb' }));

app.use(helmet());
// Handle Development Mode Features
if (process.env.NODE_ENV === 'development') {
	console.log('Development Mode Running.');
	app.use(morgan('short'));
}

app.use(
	rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 1000,
		message: {
			error: {
				name: 'TooManyRequestsError',
				message: 'Too many requests, please try again later :(',
			},
		},
		standardHeaders: true,
		legacyHeaders: false,
	})
);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());

// Middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection
app.use(mongoSanitize());

// app.use(rejectBlockedIP, checkAPIKey);

app.use('/api', ApiRoute);

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
	console.log(_req.query);
	next(new ErrorResponse('Page not found', 404));
});

app.use(globalError);

export default app;
