import type { Model } from 'mongoose';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export default class StoneService<T> {
	constructor(private _Model: Model<T>) {}
	/**
	 * Create Generator Middleware
	 * @param genFunc Form State Generator Function
	 * @returns Middleware
	 */
	generator(genFunc: () => Promise<T>) {
		const _Model = this._Model;
		return asyncHandler(async (req: Request, res: Response): Promise<void> => {
			const { MAX_GENERATE_LIMIT = 100 } = process.env;
			let { length = 0 } = req.query;
			length = +length;

			const required_number = +length > +MAX_GENERATE_LIMIT ? +MAX_GENERATE_LIMIT : +length;

			for (let i = 0; i < required_number; i++) {
				await _Model.create(await genFunc());
			}

			res.status(200).json({
				status: 'success',
				required_number: length,
				max_limit: MAX_GENERATE_LIMIT,
			});
		});
	}
	/**
	 * Create Clean Middleware to delete all documents from the collection
	 * @returns Middleware
	 */
	clean() {
		const _Model = this._Model;
		return asyncHandler(async (_req: Request, res: Response): Promise<void> => {
			const resault = await _Model.deleteMany({});
			res.status(200).json({
				status: 'success',
				count: resault.deletedCount,
			});
		});
	}
}
