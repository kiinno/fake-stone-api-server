import { HydratedDocument, Model } from 'mongoose';
import type { Response, Request, NextFunction } from 'express';
import mongooseErrorConverter from '../utils/mongooseError.converter';
import asyncHandler from 'express-async-handler';
import { SuperRequest } from '../middlewares/guard';

class GlobalService<T> {
	constructor(private _Model: Model<T>) {}
	/**
	 * Get all documents from the database collection with features like pagination and - sorting - selection - search
	 * @returns Get Documents Controller
	 */
	getDocuments(populateRef?: string, popSelect?: string) {
		const _Model = this._Model;
		return asyncHandler(async (req: Request, res: Response): Promise<void> => {
			// Pagenation
			let { page = 1, limit = 10 } = req.query;

			// Formating query fields to skip -> errors
			page = +page < 1 ? 1 : +page;
			limit = +limit < 1 ? 10 : +limit;
			const documentsLen: number = await _Model.find({}).countDocuments();
			const pages = Math.ceil(documentsLen / limit);
			const skipped: number = (page - 1) * limit;
			let available: number = documentsLen - skipped - limit;
			available = available < 0 ? 0 : available;
			const availablePages = pages && pages - page < 0 ? 0 : pages - page;
			const next = availablePages < pages && available > 1 ? page + 1 : null;

			let query: any = _Model.find({}).limit(limit).skip(skipped);

			// Selection
			const select: string = req.query.select?.toString() ?? '';
			if (select) {
				const selectFeilds: any = select.split(' ').reduce(function (previos: any, current) {
					let value = true;
					if (current.startsWith('-')) {
						current = current.slice(1);
						value = false;
					}
					previos[current] = value;
					return previos;
				}, {});
				query = query.select(selectFeilds);
			}

			// Populations
			if (populateRef) {
				query = query.populate(populateRef, popSelect);
			}

			// Send the results
			const resaults: HydratedDocument<T>[] | [] = await query;
			res.status(200).json({
				resaultsLength: resaults.length,
				limit: +limit,
				pages,
				page: page,
				prev: page - 1 < 1 ? null : page - 1,
				next,
				availablePages,
				available,
				data: resaults,
			});
		});
	}
	/**
	 * Create new document in Database
	 * @returns C
	 */
	addDocument() {
		const _Model = this._Model;
		return asyncHandler(async (req: SuperRequest, res: Response, next: NextFunction): Promise<void> => {
			try {
				const resault: HydratedDocument<T> = await _Model.create(req.body);
				res.status(200).json({ status: 'success', data: resault });
				if (req.sharps) req.sharps.ready = true;
				next();
			} catch (error: any) {
				const vError = mongooseErrorConverter(error);
				if (mongooseErrorConverter(error)) {
					if (typeof vError === 'object') {
						res.status(500).json({ ...vError, status: 'error', form: req.body });
					}
				} else {
					next(error);
				}
			}
		});
	}
}

export default GlobalService;
