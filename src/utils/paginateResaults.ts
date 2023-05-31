import { Model } from 'mongoose';

export default async function <T>(model: Model<T>, limit: number, page: number) {
	const resaults = model
		.find({})
		.limit(limit)
		.skip(limit * page);
	return resaults;
}
