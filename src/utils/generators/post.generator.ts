import { faker } from '@faker-js/faker';
import { IPOST } from '../../models/post';
import User from '../../models/user';
import { Types } from 'mongoose';

const { price } = faker.commerce;

export async function getRandomUser(): Promise<Types.ObjectId> {
	const users: Types.ObjectId[] = await User.find({}, { _id: true });
	return users[randomNumber(users.length - 1)];
}

function randomNumber(max?: number, min = 0) {
	return +price({ min, max });
}

export async function getRandomLikersList(): Promise<Types.ObjectId[]> {
	const users: Types.ObjectId[] = await User.find({}, { _id: true });
	return users.filter((): boolean => faker.datatype.boolean()).slice(0);
}

export default async function (): Promise<IPOST> {
	const { paragraph } = faker.lorem;
	const post: IPOST = {
		user: await getRandomUser(),
		caption: paragraph(),
		likers: await getRandomLikersList(),
		...(faker.datatype.boolean() && {
			images: new Array(randomNumber(20)).fill(null, 0).map((_): string => {
				const url = faker.image.url();
				return url;
			}),
		}),
	};

	return post;
}
