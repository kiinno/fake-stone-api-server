import config from '../config';
import { join, dirname, basename } from 'path';
import { unlink, rmSync } from 'fs';

export const getStringImageURL = function (v: any) {
	const { IMAGES_ROUTE = '/images' } = process.env;
	if (IMAGES_ROUTE) {
		return (v as string).replace('$IMAGES_PATH$', IMAGES_ROUTE);
	}
	return v;
};

export const setStringImageURL = (v: any) => {
	const { IMAGES_ROUTE = '/images' } = process.env;
	if ((v as string).startsWith(IMAGES_ROUTE)) {
		return (v as string).replace(IMAGES_ROUTE, '$IMAGES_PATH$');
	}
	return v;
};

export const getListStringImageURL = function (v: any) {
	const { IMAGES_ROUTE = '/images' } = process.env;
	return (v as string[]).map((thumb) => thumb.replace('$IMAGES_PATH$', IMAGES_ROUTE));
};

export const setListStringImageURL = (v: any) => {
	const { IMAGES_ROUTE = '/images' } = process.env;
	return (v as string[]).map((thumb) =>
		thumb.startsWith(IMAGES_ROUTE) ? thumb.replace(IMAGES_ROUTE, '$IMAGES_PATH$') : thumb
	);
};

export const onDeleteDocumentDeleteImages = function <T>(fields: string[]) {
	return async function (doc: T) {
		if (doc) {
			const { IMAGES_ROUTE = '/images', IMAGES_PATH = 'image' } = process.env;
			const files: {
				parents: string[];
				images: string[];
			} = { parents: [], images: [] };

			fields.forEach((fieldName: string) => {
				const field = (doc as any)[fieldName];
				if (field) {
					if (Array.isArray(field)) {
						field.forEach((fileStoredPath: string) => {
							if (fileStoredPath.startsWith(IMAGES_ROUTE)) {
								fileStoredPath = join(
									config.BASE_DIR,
									fileStoredPath.replace(IMAGES_ROUTE, IMAGES_PATH)
								);
								const dn = dirname(fileStoredPath);
								const bn = basename(dn);
								if (bn.startsWith('__u-') && files.parents.indexOf(dn) === -1) {
									files.parents.push(dn);
								} else {
									files.images.push(fileStoredPath);
								}
							}
						});
					} else if (typeof field === 'string') {
						if (field.startsWith(IMAGES_ROUTE)) {
							files.images.push(join(config.BASE_DIR, field.replace(IMAGES_ROUTE, IMAGES_PATH)));
						}
					}
				}
			});
			files.images.forEach((path) => {
				path &&
					unlink(path, (err) => {
						if (err) throw err;
					});
			});
			files.parents.forEach((path) => {
				rmSync(path, { recursive: true, force: true });
			});
		}
	};
};

export function multiReturner<T>(...methods: ((v: T) => T)[]) {
	return (v: T) => {
		return methods.reduce((prev, cur) => {
			return cur(prev);
		}, v);
	};
}
