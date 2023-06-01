import { faker } from '@faker-js/faker';
import User, { IUSER, ILOCATION } from '../../models/user';
import { Types } from 'mongoose';

export function generateLocation(): ILOCATION {
	const { buildingNumber, state, street, zipCode, countryCode, city, country, county, nearbyGPSCoordinate } =
		faker.location;
	return {
		buildingNumber: buildingNumber(),
		street: street(),
		zipCode: zipCode(),
		countryCode: countryCode(),
		state: state(),
		city: city(),
		country: country(),
		county: county(),
		gps: nearbyGPSCoordinate(),
	};
}

export async function getRandomFriendList(_max = 30): Promise<Types.ObjectId[]> {
	const users: Types.ObjectId[] = await User.find({}, { _id: true });
	return users.filter((): boolean => faker.datatype.boolean()).slice(0, _max);
	// .map((_userId: string): Types.ObjectId => new Types.ObjectId(_userId));
}

export default async function (): Promise<IUSER> {
	const { firstName, lastName, sexType, middleName, bio, jobDescriptor, jobTitle, jobType } = faker.person;
	const psex = sexType();
	const fName = firstName(psex);
	const mName = middleName(psex);
	const lName = lastName(psex);
	const password = faker.internet.password({
		memorable: true,
		length: faker.number.int({
			min: 10,
			max: 32,
		}),
	});

	// Generate Friends List
	return {
		name: {
			firstName: fName,
			middleName: mName,
			lastName: lName,
		},
		gender: psex,
		bio: bio(),
		job: {
			jobType: jobType(),
			title: jobTitle(),
			descriptor: jobDescriptor(),
			stillWorking: faker.datatype.boolean(),
			company: {
				name: faker.company.name(),
				location: generateLocation(),
			},
		},
		location: generateLocation(),
		email: faker.internet.email({
			firstName: fName,
			lastName: lName,
			allowSpecialCharacters: true,
		}),
		username: faker.internet.userName({
			firstName: fName,
			lastName: lName,
		}),
		phone: {
			primary: faker.phone.number('+## ###-####-###'),
			secondary: faker.phone.number('+## ###-####-###'),
		},
		password: password,
		plainPassword: password,
		friends: await getRandomFriendList(30),
		super: faker.number.int({ min: 0, max: 2 }) as 0 | 1 | 2,
		avatar: faker.internet.avatar(),
	};
}
