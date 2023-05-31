import { faker } from '@faker-js/faker';
import { IBlockedIP } from '../../models/blockedIp';

export default async function (): Promise<IBlockedIP> {
	const visitor: IBlockedIP = {
		ip: faker.internet.ip(),
		banned: {
			...([{ to: faker.date.soon({ days: 365 }) }, { forever: faker.datatype.boolean() }][
				+faker.datatype.boolean()
			] || {}),
		},
		...(faker.datatype.boolean() && { comment: faker.lorem.text() }),
	};

	return visitor;
}
