import { param, validationResult, Result, query } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

export const documentIDValidationChain = [param('id').isMongoId().withMessage('Invalid ID Format')];

export const documentFeaturesValidation = [
	query('page')
		.optional()
		.isInt({
			min: 1,
		})
		.withMessage('minimum number 1')
		.default(1),
	query('limit').optional().default(10),
];

export const vResault = (req: Request, res: Response, next: NextFunction) => {
	const resault: Result = validationResult(req);
	if (!resault.isEmpty()) {
		// const formatedResaults: Result<string> = resault.formatWith((err) => err.msg as string);
		const errors = resault.array();
		return next(errors);
	}
	next();
};
