import { faker } from '@faker-js/faker';
import { IProduct } from '../../models/product';
import User from '../../models/user';
import { Types } from 'mongoose';

const { price } = faker.commerce;
export async function getRandomOwner(): Promise<Types.ObjectId> {
	const users: Types.ObjectId[] = await User.find({}, { _id: true });
	return users[randomNumber(users.length - 1)];
}

function randomNumber(max?: number, min = 0) {
	return +price({ min, max });
}

export default async function (): Promise<IProduct> {
	const { productName, productDescription } = faker.commerce;
	const product: IProduct = {
		owner: await getRandomOwner(),
		title: productName(),
		description: productDescription(),
		price: randomNumber(),
		discount: randomNumber(100),
		productImage: faker.image.url(),
		thumbnails: new Array(randomNumber(20)).fill(null, 0).map((_): string => {
			const url = faker.image.url();
			return url;
		}),
	};

	return product;
}
