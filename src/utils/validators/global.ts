import { param, validationResult, Result } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
export const documentIDValidationChain = [param('id').isMongoId().withMessage('Invalid ID Format')];

export const vResault = (req: Request, res: Response, next: NextFunction) => {
	const resault: Result = validationResult(req);
	if (!resault.isEmpty()) {
		const formatedResaults: Result<string> = resault.formatWith((err) => err.msg as string);
		const errors = formatedResaults.array();
		return next(errors);
	}
	next();
};
