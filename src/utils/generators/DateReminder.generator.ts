import { faker } from '@faker-js/faker';
import { IDateReminder } from '../../models/datesReminder';

export default async function (): Promise<IDateReminder> {
	const dateReminder: IDateReminder = {
		name: faker.person.fullName(),
		date: faker.date.between({ from: '2023-01-01T00:00:00.000Z', to: '2026-01-01T00:00:00.000Z' }),
		description: faker.lorem.paragraph(),
		avatar: faker.image.avatar(),
	};

	return dateReminder;
}
