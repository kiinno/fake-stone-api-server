import type { Model } from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse';
export default class SingleDocumentService<T> {
	constructor(private _Model: Model<T>) {}
	/**
	 * Read Spicific document from Database
	 * @returns R
	 */
	getSDocument() {
		const _Model = this._Model;
		return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const resault = await _Model.findById(id);
			if (!resault) {
				next(new ErrorResponse(`No ${_Model.collection.collectionName} exists with this id '${id}`));
			} else {
				res.status(200).json({
					status: 'success',
					resault,
				});
			}
		});
	}
	/**
	 * Delete Spicific document from Database
	 * @returns D
	 */
	delSDocument() {
		const _Model = this._Model;
		return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const resault = await _Model.findByIdAndDelete(id);
			if (!resault) {
				next(new ErrorResponse(`No ${_Model.collection.collectionName} exists with this id '${id}'`, 403));
			} else {
				res.status(200).json({
					status: 'success',
					id: id,
				});
			}
		});
	}

	/**
	 * Update Spicific document from Database
	 * @returns U
	 */
	updateSDocument() {
		const _Model = this._Model;
		return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const resault = await _Model.findByIdAndUpdate(id, req.body ?? {}, { new: true });
			if (!resault) {
				next(new ErrorResponse(`No ${_Model.collection.collectionName} exists with this id '${id}'`, 403));
			} else {
				res.status(200).json({
					status: 'success',
					resault,
				});
			}
		});
	}
}
