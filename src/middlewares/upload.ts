import multer from 'multer';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from 'express-async-handler';
import type { NextFunction, Response } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import sharp from 'sharp';
import type { FieldOptions, SuperRequest } from './guard';

const upload = multer({
	fileFilter(_req, file, cb) {
		if (!file.originalname.match(/\.(png||jpg||jpeg)$/)) {
			return cb(new ErrorResponse(`Image Type ${file.mimetype} Is Not, Allowed (png, jpg, jpeg)`, 400));
		}
		cb(null, true);
	},
});

export const uniqueSuffix = () => `${Date.now()}-${Math.trunc(Math.random() * 1e7)}`;

export const imageHandler = (options: FieldOptions[]) => {
	return asyncHandler(async (req: SuperRequest, _res: Response, next: NextFunction) => {
		const promises = [...options].map((file) => {
			const buffer: Buffer[] = [];
			const formatedDest = `${file.dest.replace(/\*/g, uniqueSuffix())}`;
			if (req.file && req.file.fieldname === file.fieldName) {
				buffer.push(req.file.buffer as never);
			} else if (req.files && (req.files as any)[file.fieldName]) {
				const uploadedFiles = (req.files as any)[file.fieldName];
				uploadedFiles.forEach((f: Express.Multer.File) => {
					buffer.push(f.buffer);
				});
			}
			return buffer.map((buf) => {
				const { UPLOADS_PATH = 'uploads', UPLOADS_ROUTE = '/uploads' } = process.env;
				const fileName = `${uniqueSuffix()}.png`;

				const path = join(__dirname, '..', UPLOADS_PATH, formatedDest);
				const filePath = join(path, fileName);

				const servedPath = `${UPLOADS_ROUTE}/${formatedDest}/${fileName}`;

				if (!existsSync(path)) {
					mkdirSync(path, { recursive: true });
				}

				if (file.multiple) {
					if (Array.isArray(req.body[file.fieldName])) req.body[file.fieldName].push(servedPath);
					else req.body[file.fieldName] = [servedPath];
				} else req.body[file.fieldName] = servedPath;

				return { file, buffer: buf, path: filePath };
			});
		});
		let sharps: any[] = [];
		for (const i of promises) {
			if (Array.isArray(i)) {
				sharps = sharps.concat(i);
			} else {
				sharps.push(i);
			}
		}
		req.sharps = {
			ready: false,
			sharps,
		};

		next();
	});
};

export const saveSharps = asyncHandler(async (req: SuperRequest, _res: Response) => {
	if (req.sharps?.ready) {
		req.sharps.sharps?.map(async (sharpFile) => {
			if (sharp) {
				await sharp(sharpFile.buffer)
					.resize({
						...(sharpFile.file.width && { width: sharpFile.file.width }),
						...(sharpFile.file.height && { height: sharpFile.file.height }),
					})
					.png()
					.toFile(sharpFile.path);
			}
		});
	}
});

export default upload;
