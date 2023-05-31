import type { Model } from 'mongoose';
import type { Request, Response } from 'express';

export default class StoneService<T> {
	constructor(private _Model: Model<T>) {}

	generator(genFunc: () => Promise<T>) {
		const _Model = this._Model;
		return async function (req: Request, res: Response): Promise<void> {
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
		};
	}

	clean() {
		const _Model = this._Model;
		return async function (_req: Request, res: Response): Promise<void> {
			const resault = await _Model.deleteMany({});
			res.status(200).json({
				status: 'success',
				count: resault.deletedCount,
			});
		};
	}
}
