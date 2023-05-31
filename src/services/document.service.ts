import type { Model } from 'mongoose';
import type { Request, Response } from 'express';

export default class SingleDocumentService<T> {
	constructor(private _Model: Model<T>) {}

	getSDocument() {
		const _Model = this._Model;
		return async function (req: Request, res: Response): Promise<void> {
			const { id } = req.params;
			const resault = await _Model.findById(id);
			if (!resault) {
				res.status(403).json({
					status: 'faild',
					message: `No ${_Model.collection.collectionName} exists with this id '${id}'`,
				});
			} else {
				res.status(200).json({
					status: 'success',
					resault,
				});
			}
		};
	}

	delSDocument() {
		const _Model = this._Model;
		return async function (req: Request, res: Response): Promise<void> {
			const { id } = req.params;
			const resault = await _Model.findById(id);
			if (!resault) {
				res.status(403).json({
					status: 'faild',
					message: `No ${_Model.collection.collectionName} exists with this id '${id}'`,
				});
			} else {
				res.status(200).json({
					status: 'success',
					id: id,
				});
			}
		};
	}

	updateSDocument() {
		const _Model = this._Model;
		return async function (req: Request, res: Response): Promise<void> {
			const { id } = req.params;
			const resault = await _Model.findByIdAndUpdate(id, req.body ?? {}, { new: true });
			if (!resault) {
				res.status(403).json({
					status: 'faild',
					message: `No ${_Model.collection.collectionName} exists with this id '${id}'`,
				});
			} else {
				res.status(200).json({
					status: 'success',
					resault,
				});
			}
		};
	}
}
